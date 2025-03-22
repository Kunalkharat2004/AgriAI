const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const colors = require("colors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const http = require("http");
const socketIo = require("socket.io");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Simple test route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to AgriAI API" });
});

// Routes
app.use("/api/users", userRoutes);

// Define sample API route
app.get("/api/products", (req, res) => {
  // Mock products data
  const products = [
    {
      id: 1,
      name: "Tomato Seeds",
      description: "High-yield tomato seeds suitable for various climates",
      price: 120,
      image: "https://example.com/tomato-seeds.jpg",
      category: "seeds",
    },
    {
      id: 2,
      name: "Organic Fertilizer",
      description: "Chemical-free organic fertilizer for all crops",
      price: 350,
      image: "https://example.com/organic-fertilizer.jpg",
      category: "fertilizers",
    },
    {
      id: 3,
      name: "Garden Tool Set",
      description: "Complete set of essential garden tools",
      price: 1200,
      image: "https://example.com/garden-tools.jpg",
      category: "tools",
    },
  ];

  res.json({
    success: true,
    count: products.length,
    data: products,
  });
});

// Order API endpoint
app.post("/api/orders", (req, res) => {
  try {
    const { items, customerInfo, totalAmount } = req.body;

    // Log the order data
    console.log("New order received:", {
      items,
      customerInfo,
      totalAmount,
      timestamp: new Date().toISOString(),
    });

    // In a real app, you would save this to a database
    // For now, we'll just return a success response with order ID
    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      orderId: "ORD" + Date.now(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
});

// Socket.io connection
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Join a specific room (e.g., for a specific device)
  socket.on("join_device", (deviceId) => {
    socket.join(deviceId);
    console.log(`Socket ${socket.id} joined device room: ${deviceId}`);
  });

  // Handle sensor data updates
  socket.on("sensor_data", (data) => {
    console.log("Received sensor data:", data);
    // Broadcast to specific device room or to all clients
    io.to(data.deviceId).emit("sensor_update", data);
  });

  // Handle moisture level alerts
  socket.on("moisture_alert", (data) => {
    console.log("Moisture alert:", data);
    io.emit("alert", {
      type: "moisture",
      message: `Moisture level ${data.level}% is ${data.status}`,
      timestamp: new Date().toISOString(),
      ...data,
    });
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist", "index.html"));
  });
}

// Define port - use the existing port from .env
const PORT = process.env.PORT || 3600;

// Start server with socket.io
server.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
  console.log(`Socket.io server is running`.green.bold);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});
