import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

// Protected routes
router.post("/", authenticate, createOrder);
router.get("/", authenticate, getOrders);
router.get("/:id", authenticate, getOrderById);
router.put("/:id/status", authenticate, updateOrderStatus);

// Test endpoint (to be removed in production)
router.post("/test", (req, res) => {
  console.log("Test order endpoint hit:", req.body);
  res.status(200).json({ message: "Test endpoint working" });
});

export default router;
