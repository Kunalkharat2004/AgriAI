import { NextFunction, Request, Response } from "express";
import { CreateOrderRequestBody } from "../utils/orderTypes";
import Order from "../models/orderModel";
import { CustomError } from "../utils/error";
import { AuthRequest } from "../middlewares/authentication";
import { emitOrderUpdate, emitNewOrder } from "../socket";
import mongoose from "mongoose";

// Interface for Order document with proper typing
interface IOrderDocument extends mongoose.Document {
  status: string;
  _id: mongoose.Types.ObjectId;
  user: string;
  // Add other properties as needed
}

// Generate a unique order number
const generateOrderNumber = (): string => {
  const prefix = "AGR";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `${prefix}-${timestamp}-${random}`;
};

// Mock orders data (replace with database in production)
let orders: any[] = [];

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { items, customerInfo, totalAmount } = req.body;

    // Validate request body
    if (!items || !customerInfo || !totalAmount) {
      throw new CustomError("Please provide all required fields", 400);
    }

    // Create new order with user ID from authenticated user
    const newOrder = {
      id: Date.now().toString(),
      userId: req.user.id,
      items,
      customerInfo,
      totalAmount,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // In a real app, save to database
    orders.push(newOrder);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders for user
// @route   GET /api/orders
// @access  Private
export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // In a real app, filter from database
    const userOrders = orders.filter((order) => order.userId === req.user.id);

    res.status(200).json({
      success: true,
      count: userOrders.length,
      orders: userOrders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = orders.find((o) => o.id === req.params.id);

    if (!order) {
      throw new CustomError("Order not found", 404);
    }

    // Check if the order belongs to the authenticated user
    if (order.userId !== req.user.id && req.user.role !== "admin") {
      throw new CustomError("Not authorized to access this order", 403);
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// Get all orders for a user
export const getUserOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user._id;

    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: orders.length,
      data: orders,
    });
  } catch (err) {
    next(err);
  }
};

// Cancel an order
export const cancelOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orderId = req.params.id;
    const authReq = req as AuthRequest;
    const userId = authReq.user._id;

    const order = (await Order.findOne({
      _id: orderId,
      user: userId,
    })) as IOrderDocument;

    if (!order) {
      throw new CustomError("Order not found", 404);
    }

    // Check if order can be cancelled
    if (order.status === "shipped" || order.status === "delivered") {
      throw new CustomError(
        "Cannot cancel an order that has already been shipped or delivered",
        400
      );
    }

    // Update order status to cancelled
    order.status = "cancelled";
    await order.save();

    // Emit order update for admin dashboard - use a string version of the ID
    const orderIdString = order._id.toString();
    emitOrderUpdate(orderIdString, {
      status: "cancelled",
      orderId: orderIdString,
      userId: order.user,
    });

    res.status(200).json({
      status: "success",
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

// Get admin order dashboard (for admins only)
export const getOrdersDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // This should be protected by an admin middleware
    const pendingCount = await Order.countDocuments({ status: "pending" });
    const processingCount = await Order.countDocuments({
      status: "processing",
    });
    const shippedCount = await Order.countDocuments({ status: "shipped" });
    const deliveredCount = await Order.countDocuments({ status: "delivered" });
    const cancelledCount = await Order.countDocuments({ status: "cancelled" });

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("user", "email");

    res.status(200).json({
      status: "success",
      data: {
        counts: {
          pending: pendingCount,
          processing: processingCount,
          shipped: shippedCount,
          delivered: deliveredCount,
          cancelled: cancelledCount,
          total:
            pendingCount +
            processingCount +
            shippedCount +
            deliveredCount +
            cancelledCount,
        },
        recentOrders,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Get all orders with pagination and filtering (for admins only)
export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};
    if (status && status !== "all") {
      filter.status = status;
    }

    // Get total count for pagination
    const totalOrders = await Order.countDocuments(filter);

    // Get orders with pagination
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "email");

    res.status(200).json({
      status: "success",
      results: orders.length,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalItems: totalOrders,
        itemsPerPage: limit,
      },
      data: orders,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin only in full implementation)
export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status } = req.body;

    if (!status) {
      throw new CustomError("Please provide a status", 400);
    }

    const orderIndex = orders.findIndex((o) => o.id === req.params.id);

    if (orderIndex === -1) {
      throw new CustomError("Order not found", 404);
    }

    // Update order status
    orders[orderIndex] = {
      ...orders[orderIndex],
      status,
      updatedAt: new Date().toISOString(),
    };

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order: orders[orderIndex],
    });
  } catch (error) {
    next(error);
  }
};
