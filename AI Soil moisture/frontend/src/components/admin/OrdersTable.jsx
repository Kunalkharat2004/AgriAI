import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  TablePagination,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  useTheme,
} from "@mui/material";
import { MoreVert, Visibility, Edit } from "@mui/icons-material";
import { updateOrderStatus } from "../../services/adminService";
import { formatDate } from "../../utils/helpers";

// Order status chip colors
const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "warning";
    case "processing":
      return "info";
    case "shipped":
      return "primary";
    case "delivered":
      return "success";
    case "cancelled":
      return "error";
    default:
      return "default";
  }
};

// Before the OrdersTable component, add a helper function to handle order items
const getOrderItems = (order) => {
  // Handle different property names for order items
  return order.orderItems || order.items || [];
};

// Improve the calculateOrderTotals function
const calculateOrderTotals = (order) => {
  if (!order) return { subtotal: 0, shipping: 0, total: 0 };
  
  const items = order.orderItems || order.items || [];
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );
  
  // Parse numeric values to ensure they're numbers
  const existingSubtotal = typeof order.subTotal === 'number' ? order.subTotal : 
                         (typeof order.subTotal === 'string' ? parseFloat(order.subTotal) : null);
  
  const shippingPrice = typeof order.shippingPrice === 'number' ? order.shippingPrice : 
                       (typeof order.shippingPrice === 'string' ? parseFloat(order.shippingPrice) : null);
  
  const methodPrice = order.shippingMethod?.price;
  const shippingMethodPrice = typeof methodPrice === 'number' ? methodPrice : 
                             (typeof methodPrice === 'string' ? parseFloat(methodPrice) : null);
  
  // Use existing values if available, otherwise calculate
  const result = {
    subtotal: existingSubtotal || subtotal || 0,
    shipping: shippingPrice || shippingMethodPrice || 0,
    total: 0 // Will be calculated below
  };
  
  // Calculate total
  if (typeof order.total === 'number') {
    result.total = order.total;
  } else if (typeof order.total === 'string') {
    result.total = parseFloat(order.total);
  } else if (typeof order.totalPrice === 'number') {
    result.total = order.totalPrice;
  } else if (typeof order.totalPrice === 'string') {
    result.total = parseFloat(order.totalPrice);
  } else {
    // If no total provided, calculate it
    result.total = result.subtotal + result.shipping;
  }
  
  // Ensure all values are valid numbers (not NaN)
  if (isNaN(result.subtotal)) result.subtotal = 0;
  if (isNaN(result.shipping)) result.shipping = 0;
  if (isNaN(result.total)) result.total = 0;
  
  return result;
};

// Add a helper function to safely display order status
const getSafeStatus = (status) => {
  return status ? status.toUpperCase() : "PENDING";
};

// Add a helper function for currency formatting
const formatCurrency = (amount) => {
  // Ensure the amount is a valid number
  const safeAmount = Number(amount) || 0;
  return `₹${safeAmount.toFixed(2)}`;
};

const OrdersTable = ({ orders, pagination, onPageChange, onStatusUpdate }) => {
  const theme = useTheme();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Handle menu open
  const handleMenuClick = (event, order) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  // Open status change dialog
  const handleOpenStatusDialog = () => {
    setMenuAnchorEl(null);
    setStatusDialogOpen(true);
  };

  // Close status change dialog
  const handleCloseStatusDialog = () => {
    setStatusDialogOpen(false);
  };

  // Open order details dialog
  const handleOpenDetailsDialog = () => {
    setMenuAnchorEl(null);
    setDetailsDialogOpen(true);
  };

  // Close order details dialog
  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false);
  };

  // Handle status change
  const handleStatusChange = async (newStatus) => {
    if (!selectedOrder) return;

    setUpdatingStatus(true);
    try {
      const response = await updateOrderStatus(selectedOrder._id, newStatus);
      if (response.status === "success") {
        // Call the parent component's callback to refresh data
        if (onStatusUpdate) onStatusUpdate();
      } else {
        console.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setUpdatingStatus(false);
      handleCloseStatusDialog();
    }
  };

  // Render status change dialog
  const renderStatusDialog = () => {
    if (!selectedOrder) return null;

    const statusOptions = [
      { value: "pending", label: "Pending" },
      { value: "processing", label: "Processing" },
      { value: "shipped", label: "Shipped" },
      { value: "delivered", label: "Delivered" },
      { value: "cancelled", label: "Cancelled" },
    ];

    return (
      <Dialog open={statusDialogOpen} onClose={handleCloseStatusDialog}>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Current status:{" "}
            <Chip
              size="small"
              label={getSafeStatus(selectedOrder.status)}
              color={getStatusColor(selectedOrder.status || "pending")}
            />
          </Typography>
          <Typography variant="body2" gutterBottom>
            Select new status:
          </Typography>
          <Stack spacing={1} mt={1}>
            {statusOptions.map((option) => (
              <Button
                key={option.value}
                variant={
                  selectedOrder.status === option.value
                    ? "outlined"
                    : "contained"
                }
                color={getStatusColor(option.value)}
                onClick={() => handleStatusChange(option.value)}
                disabled={
                  updatingStatus || selectedOrder.status === option.value
                }
                startIcon={
                  updatingStatus && selectedOrder.status !== option.value ? (
                    <CircularProgress size={16} />
                  ) : null
                }
              >
                {option.label}
              </Button>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
    );
  };

  // Render order details dialog
  const renderDetailsDialog = () => {
    if (!selectedOrder) return null;

    return (
      <Dialog
        open={detailsDialogOpen}
        onClose={handleCloseDetailsDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Order Details - {selectedOrder.orderNumber}</DialogTitle>
        <DialogContent dividers>
          <Box mb={3}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Order Information
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
              <Typography variant="body2">
                <strong>Date:</strong> {formatDate(selectedOrder.createdAt)}
              </Typography>
              <Typography variant="body2">
                <strong>Status:</strong>{" "}
                <Chip
                  size="small"
                  label={getSafeStatus(selectedOrder.status)}
                  color={getStatusColor(selectedOrder.status || "pending")}
                />
              </Typography>
              <Typography variant="body2">
                <strong>Customer:</strong>{" "}
                {selectedOrder.user ? selectedOrder.user.email : "N/A"}
              </Typography>
              <Typography variant="body2">
                <strong>Payment Method:</strong> {selectedOrder.paymentMethod}
              </Typography>
            </Box>
          </Box>

          <Box mb={3}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Shipping Information
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
              <Typography variant="body2">
                <strong>Name:</strong> {selectedOrder.shippingInfo?.name || selectedOrder.shippingAddress?.name || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Address:</strong> {selectedOrder.shippingInfo?.address || selectedOrder.shippingAddress?.address || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>City:</strong> {selectedOrder.shippingInfo?.city || selectedOrder.shippingAddress?.city || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>State:</strong> {selectedOrder.shippingInfo?.state || selectedOrder.shippingAddress?.state || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Zip:</strong> {selectedOrder.shippingInfo?.pincode || selectedOrder.shippingAddress?.pincode || selectedOrder.shippingInfo?.zipCode || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Country:</strong> {selectedOrder.shippingInfo?.country || 'India'}
              </Typography>
              <Typography variant="body2">
                <strong>Phone:</strong> {selectedOrder.shippingInfo?.phone || selectedOrder.shippingAddress?.phone || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Shipping Method:</strong>{" "}
                {selectedOrder.shippingMethod?.name || "N/A"}
              </Typography>
            </Box>
          </Box>

          <Box mb={3}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Order Items
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getOrderItems(selectedOrder).map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell align="right">
                        {item.quantity}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(item.price || 0)}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency((item.price || 0) * (item.quantity || 1))}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3}>Subtotal</TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2">
                        {formatCurrency(calculateOrderTotals(selectedOrder).subtotal)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3}>Shipping</TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2">
                        {formatCurrency(calculateOrderTotals(selectedOrder).shipping)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Total
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2" fontWeight="bold">
                        {formatCurrency(calculateOrderTotals(selectedOrder).total)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleCloseDetailsDialog();
              handleOpenStatusDialog();
            }}
            color="primary"
            startIcon={<Edit />}
          >
            Update Status
          </Button>
          <Button onClick={handleCloseDetailsDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  };

  if (!orders || orders.length === 0) {
    return (
      <Box p={3} display="flex" justifyContent="center">
        <Typography color="text.secondary">No orders found.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ boxShadow: "none" }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order._id}
                sx={{
                  "&:hover": { backgroundColor: theme.palette.action.hover },
                }}
              >
                <TableCell>{order.orderNumber}</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>{order.user?.email || "N/A"}</TableCell>
                <TableCell align="right">
                  {formatCurrency(order.total || order.totalPrice || 0)}
                </TableCell>
                <TableCell>
                  <Chip
                    label={getSafeStatus(order.status)}
                    color={getStatusColor(order.status || "pending")}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedOrder(order);
                      setDetailsDialogOpen(true);
                    }}
                  >
                    <Visibility fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(event) => handleMenuClick(event, order)}
                  >
                    <MoreVert fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={pagination.totalItems}
        page={pagination.currentPage - 1}
        onPageChange={onPageChange}
        rowsPerPage={pagination.itemsPerPage}
        rowsPerPageOptions={[10]}
        onRowsPerPageChange={() => {}}
      />

      {/* Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleOpenDetailsDialog}>
          <Visibility fontSize="small" sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleOpenStatusDialog}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Update Status
        </MenuItem>
      </Menu>

      {/* Dialogs */}
      {renderStatusDialog()}
      {renderDetailsDialog()}
    </Box>
  );
};

export default OrdersTable;
