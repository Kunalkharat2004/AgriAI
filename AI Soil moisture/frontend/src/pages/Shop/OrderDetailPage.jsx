import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  useTheme,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentIcon from "@mui/icons-material/Payment";
import InventoryIcon from "@mui/icons-material/Inventory";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ReceiptIcon from "@mui/icons-material/Receipt";

import { getOrderById, cancelOrder } from "../../services/orderService";
import {
  initializeSocket,
  joinUserOrdersRoom,
  onUserEvent,
  cleanupUserListeners,
} from "../../services/socketService";
import useAuthStore from "../../store/useAuthStore";

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchOrderDetails();

    // Initialize WebSocket connection for real-time updates
    if (user && user._id) {
      const socket = initializeSocket();
      joinUserOrdersRoom(user._id);

      // Listen for order updates
      const unsubscribe = onUserEvent("user_order_updated", (data) => {
        console.log("Order update received:", data);

        // Update current order if it matches
        if (data.orderId === orderId) {
          setOrder((prevOrder) => {
            if (prevOrder) {
              return { ...prevOrder, status: data.status };
            }
            return prevOrder;
          });
        }
      });

      // Cleanup on component unmount
      return () => {
        unsubscribe();
        cleanupUserListeners();
      };
    }
  }, [orderId, user]);

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toFixed(2)}`;
  };

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await getOrderById(orderId);
      console.log("Full order details response:", response);
      
      let orderData;
      
      // Handle different response structures
      if (response.order) {
        // Response format: { success: true, order: {...} }
        orderData = response.order;
      } else if (response.data) {
        // Response format: { status: 'success', data: {...} }
        orderData = response.data;
      } else {
        // Fallback to using the entire response if it has required fields
        if (response._id || response.orderNumber) {
          orderData = response;
        } else {
          throw new Error("Invalid order data structure received");
        }
      }
      
      // Ensure orderItems or items is available
      const items = orderData.orderItems || orderData.items || [];
      console.log("Order items:", items);
      
      // Calculate subtotal from order items if not provided
      const calculatedSubtotal = items.reduce((sum, item) => 
        sum + ((Number(item.price) || 0) * (Number(item.quantity) || 1)), 0);
      
      // Use existing subTotal or calculate it
      orderData.subTotal = orderData.subTotal || calculatedSubtotal;
      console.log("Calculated subtotal:", calculatedSubtotal);
      
      // Handle mapping between different field names
      orderData.shippingMethod = orderData.shippingMethod || {
        name: "Standard Shipping",
        price: Number(orderData.shippingPrice) || 0
      };
      
      console.log("Shipping method/price:", orderData.shippingMethod, orderData.shippingPrice);
      
      // If totalPrice exists but total doesn't, use totalPrice
      if (orderData.totalPrice && !orderData.total) {
        orderData.total = Number(orderData.totalPrice);
      }
      
      // If neither exists, calculate total
      if (!orderData.total && !orderData.totalPrice) {
        const subtotal = Number(orderData.subTotal) || 0;
        const shipping = Number(orderData.shippingMethod?.price) || Number(orderData.shippingPrice) || 0;
        orderData.total = subtotal + shipping;
      }
      
      console.log("Final order total:", orderData.total);
      
      // Map shippingAddress to shippingInfo if needed
      if (orderData.shippingAddress && !orderData.shippingInfo) {
        orderData.shippingInfo = orderData.shippingAddress;
      }
      
      console.log("Processed order data:", orderData);
      setOrder(orderData);
      setError(null);
    } catch (err) {
      console.error("Error fetching order details:", err);
      let errorMessage = "Failed to load order details. Please try again.";
      
      if (err.response) {
        console.error("Error response:", err.response);
        if (err.response.status === 404) {
          errorMessage = "Order not found. It may have been removed or you don't have access.";
        } else if (err.response.status === 403) {
          errorMessage = "You don't have permission to view this order.";
        } else if (err.response.status === 401) {
          errorMessage = "Authentication required. Please log in again.";
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      setCancelling(true);
      await cancelOrder(orderId);
      fetchOrderDetails(); // Refresh order details
    } catch (err) {
      console.error("Error cancelling order:", err);
      setError(
        err.response?.data?.message ||
          "Failed to cancel order. Please try again."
      );
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusChipColor = (status) => {
    const statusColors = {
      pending: "warning",
      processing: "info",
      shipped: "primary",
      delivered: "success",
      cancelled: "error",
    };
    return statusColors[status] || "default";
  };

  const getPaymentMethodLabel = (method) => {
    const methods = {
      cod: "Cash on Delivery",
      upi: "UPI Payment",
      card: "Card Payment",
    };
    return methods[method] || method;
  };

  const calculateSubtotal = (orderData) => {
    if (!orderData) return 0;
    
    const items = orderData.orderItems || orderData.items || [];
    return items.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 1)), 0);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/shop/orders")}
          sx={{ mb: 3 }}
        >
          Back to Orders
        </Button>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/shop/orders")}
          sx={{ mb: 3 }}
        >
          Back to Orders
        </Button>
        <Alert severity="warning">
          Order not found. It may have been removed or you don't have access.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/shop/orders")}
        sx={{ mb: 3 }}
      >
        Back to Orders
      </Button>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: "background.paper",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <ReceiptIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="h6" component="h1" fontWeight={600}>
                    Order #{order.orderNumber}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Placed on {order.createdAt ? formatDate(order.createdAt) : 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} sx={{ textAlign: { sm: "right" } }}>
                <Chip
                  label={
                    order.status 
                      ? order.status.charAt(0).toUpperCase() + order.status.slice(1)
                      : "Pending"
                  }
                  color={getStatusChipColor(order.status || "pending")}
                  sx={{ mb: 1 }}
                />
                {(order.status === "pending" ||
                  order.status === "processing") && (
                  <Box sx={{ mt: 1 }}>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={handleCancelOrder}
                      disabled={cancelling}
                    >
                      {cancelling ? "Cancelling..." : "Cancel Order"}
                    </Button>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Order Items
            </Typography>
            <List disablePadding>
              {(order.orderItems || order.items || []).map((item, index) => (
                <React.Fragment key={item.productId || item.product || index}>
                  <ListItem
                    sx={{
                      py: 2,
                      px: 0,
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      alignItems: { xs: "flex-start", sm: "center" },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        width: "100%",
                        mb: { xs: 2, sm: 0 },
                      }}
                    >
                      <CardMedia
                        component="img"
                        sx={{
                          width: 80,
                          height: 80,
                          objectFit: "cover",
                          borderRadius: 1,
                          mr: 2,
                        }}
                        image={
                          item.image ||
                          "https://via.placeholder.com/80?text=Product"
                        }
                        alt={item.name}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1">{item.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Category: {item.category || 'General'}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mt: 1,
                          }}
                        >
                          <Typography variant="body2">
                            {formatCurrency(item.price)} × {item.quantity || 1}
                          </Typography>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {formatCurrency((item.price || 0) * (item.quantity || 1))}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </ListItem>
                  {index < (order.orderItems || order.items || []).length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Grid container spacing={3} direction="column">
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Order Summary
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={8}>
                      <Typography variant="body2">Subtotal</Typography>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: "right" }}>
                      <Typography variant="body2">
                        {formatCurrency(calculateSubtotal(order))}
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2">Shipping</Typography>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: "right" }}>
                      <Typography variant="body2">
                        {formatCurrency(order.shippingMethod?.price || order.shippingPrice || 0)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={1}>
                  <Grid item xs={8}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Total
                    </Typography>
                  </Grid>
                  <Grid item xs={4} sx={{ textAlign: "right" }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      color="primary"
                    >
                      {formatCurrency(order.total || order.totalPrice || 0)}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Shipping Information
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" fontWeight={500}>
                    {order.shippingInfo?.name || order.shippingAddress?.name || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.shippingInfo?.phone || order.shippingAddress?.phone || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.shippingInfo?.address || order.shippingAddress?.address || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.shippingInfo?.city || order.shippingAddress?.city || 'N/A'}, 
                    {order.shippingInfo?.state || order.shippingAddress?.state || 'N/A'} - 
                    {order.shippingInfo?.pincode || order.shippingAddress?.pincode || 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Shipping Method
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <LocalShippingIcon
                      fontSize="small"
                      sx={{ mr: 1, color: "primary.main" }}
                    />
                    <Typography variant="body2">
                      {order.shippingMethod?.name || 'Standard Shipping'} - {formatCurrency(order.shippingMethod?.price || 0)}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Payment Information
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <PaymentIcon
                    fontSize="small"
                    sx={{ mr: 1, color: "primary.main" }}
                  />
                  <Typography variant="body2">
                    {getPaymentMethodLabel(order.paymentMethod || 'cod')}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderDetailPage;
