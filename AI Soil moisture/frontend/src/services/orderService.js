import { getApiUrl } from "../config/constants";
import axios from "axios";
import useTokenStore from "../store/useTokenStore";

// Variable to store the current token
let currentToken = null;

// Function to set the current token from the store
export const initializeToken = () => {
  const token = useTokenStore.getState().token;
  if (token) {
    currentToken = token;
    return true;
  }
  return false;
};

// Helper function to get auth header with token
const getAuthHeader = () => {
  try {
    // First try to get token from Zustand store
    if (!currentToken) {
      try {
        initializeToken();
      } catch (error) {
        console.error("Failed to initialize token from store:", error);
      }
    }

    // If still no token, try localStorage as fallback
    if (!currentToken) {
      const localToken = 
        localStorage.getItem("token") ||
        localStorage.getItem("auth-token") ||
        sessionStorage.getItem("token") ||
        sessionStorage.getItem("auth-token");
      
      if (localToken) {
        console.log("Retrieved token from storage:", localToken.substring(0, 10) + "...");
        currentToken = localToken;
      }
    }

    // Debug logging
    console.log("getAuthHeader called");
    console.log("localStorage keys:", Object.keys(localStorage));
    const tokenFound = !!currentToken;
    console.log("Token found:", tokenFound);

    if (!currentToken) {
      console.warn("No authentication token found!");
      
      // Return empty headers if no token is found
      return {
        headers: {
          "Content-Type": "application/json",
        },
      };
    }

    // Check token format
    if (typeof currentToken !== 'string') {
      console.warn("Token is not a string:", typeof currentToken);
      currentToken = String(currentToken);
    }

    console.log("Auth token found:", currentToken.substring(0, 10) + "...");
    
    // Format the token correctly - ensure it's a Bearer token
    let formattedToken = currentToken;
    if (!formattedToken.startsWith("Bearer ")) {
      formattedToken = `Bearer ${formattedToken}`;
    }
    
    return {
      headers: {
        "Content-Type": "application/json",
        Authorization: formattedToken,
      },
    };
  } catch (error) {
    console.error("Error in getAuthHeader:", error);
    // Fallback to minimal headers
    return {
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
};

// Create a new order
export const createOrder = async (orderData) => {
  try {
    // Ensure we have the latest token
    initializeToken();

    const baseUrl = getApiUrl();
    console.log("Base URL is this->:", baseUrl);
    const url = `${baseUrl}/orders`;
    console.log("Making order request to:", url);
    console.log("Order data:", JSON.stringify(orderData));

    // Get auth headers properly
    const headers = getAuthHeader();
    console.log("Request headers:", headers);

    // Make the request with proper configuration
    const response = await axios.post(url, orderData, {
      headers: headers.headers,
      withCredentials: true,
    });

    console.log("Order response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    console.error("Error details:", error.response?.data || "No response data");
    console.error("Error status:", error.response?.status || "No status");
    throw error;
  }
};

// Get all orders for the current user
export const getUserOrders = async () => {
  try {
    // Ensure we have the latest token
    initializeToken();

    // Get fresh auth headers with debug logging
    const authHeaders = getAuthHeader();
    console.log("getUserOrders Auth Headers:", {
      contentType: authHeaders.headers["Content-Type"],
      authToken: authHeaders.headers.Authorization ? 
        authHeaders.headers.Authorization.substring(0, 20) + '...' : 
        'No token'
    });

    const baseUrl = getApiUrl();
    const url = `${baseUrl}/orders/user`;
    console.log("Fetching orders from:", url);

    // Use a more explicit configuration 
    const response = await axios({
      method: 'get',
      url: url,
      headers: authHeaders.headers,
      withCredentials: true, // Include cookies if any
    });

    console.log("Orders response status:", response.status);
    console.log("Orders data count:", response.data?.data?.length || 0);
    
    return response.data;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    if (error.response) {
      console.error("Error status:", error.response.status);
      console.error("Error data:", error.response.data);
    }
    throw error;
  }
};

// Get a specific order by ID
export const getOrderById = async (orderId) => {
  try {
    // Ensure we have the latest token
    initializeToken();

    // Get auth headers with debug info
    const authHeaders = getAuthHeader();
    console.log("Order details request headers:", {
      contentType: authHeaders.headers["Content-Type"],
      authPresent: !!authHeaders.headers.Authorization,
      authStart: authHeaders.headers.Authorization ? 
        authHeaders.headers.Authorization.substring(0, 20) + '...' : 
        'No token'
    });

    const baseUrl = getApiUrl();
    const url = `${baseUrl}/orders/${orderId}`;
    console.log("Fetching order from:", url);
    console.log("Order ID:", orderId);
    
    // Use more explicit configuration
    const response = await axios({
      method: 'get',
      url: url,
      headers: authHeaders.headers,
      withCredentials: true, // Include cookies if any
    });
    
    console.log("Order response status:", response.status);
    console.log("Order data:", response.data?.success, response.data?.order ? "Order found" : "No order data");
    
    return response.data;
  } catch (error) {
    console.error("Error fetching order details:", error);
    if (error.response) {
      console.error("Error status:", error.response.status);
      console.error("Error data:", error.response.data);
    }
    throw error;
  }
};

// Cancel an order
export const cancelOrder = async (orderId) => {
  try {
    // Ensure we have the latest token
    initializeToken();

    const baseUrl = getApiUrl();
    const response = await axios.patch(
      `${baseUrl}/orders/${orderId}/cancel`,
      {},
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Error canceling order:", error);
    throw error;
  }
};

// Test order endpoint without authentication
export const testOrder = async (testData) => {
  try {
    const baseUrl = getApiUrl();
    console.log("Testing order endpoint with:", testData);
    const response = await axios.post(`${baseUrl}/orders/test`, testData);
    console.log("Test order response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error testing order endpoint:", error);
    console.error("Error details:", error.response?.data || "No response data");
    console.error("Error status:", error.response?.status || "No status");
    throw error;
  }
};
