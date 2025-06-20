import dotenv from "dotenv";

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3600,
  mongoURI: process.env.MONGO_CONNECTION_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  allowedOrigins: [
    "http://localhost:5173",
    "https://agri-ai-rosy.vercel.app",
  ]
};
if (!config.jwtSecret) {
    throw new Error('JWT_SECRET environment variable is required');
}