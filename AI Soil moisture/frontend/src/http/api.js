import axios from "axios";
import config from "../config/config";

const api = axios.create({
  baseURL: config.backendUrl,
  withCredentials: true, // Include cookies with requests
});

// Log requests
api.interceptors.request.use((request) => {
  console.log("API Request:", request);
  return request;
});

// Log responses
api.interceptors.response.use(
  (response) => {
    console.log("API Response:", response);
    return response;
  },
  (error) => {
    console.error("API Error:", error.response || error);
    return Promise.reject(error);
  }
);

export const login = async (data) => {
  return api.post("/users/login", data);
};
export const register = async (data) => {
  const isFormData =
    typeof FormData !== "undefined" && data instanceof FormData;
  return api.post("/users/register", data, {
    headers: isFormData
      ? { "Content-Type": "multipart/form-data" }
      : { "Content-Type": "application/json" },
  });
};

export const getExperts = async () => {
  const res = await api.get("/users/experts");
  return res.data;
};
