import Footer from "../common/Footer";
import Navbar from "../common/Navbar";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import ScrollToTop from "../common/ScrollToTop";
import ChatBot from "../common/Chatbot";
import useTokenStore from "../../store/useTokenStore";

const MainLayout = () => {
  const { token, userRole } = useTokenStore((state) => state);
  const location = useLocation();

  // Redirect if token is missing
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  // Redirect admins to admin dashboard only if they're on the home page
  // This prevents redirect loops when navigating between pages
  if (
    userRole === "admin" &&
    (location.pathname === "/" || location.pathname === "/home")
  ) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default MainLayout;
