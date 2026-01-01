import { Navigate, Outlet } from "react-router-dom";
import ScrollToTop from "../common/ScrollToTop";
import useTokenStore from "../../store/useTokenStore";

const Auth = () => {
	const { token, userRole } = useTokenStore((state) => state);
	if (token) {
		// Redirect admin users to admin dashboard, others to home
		const redirectPath = userRole === "admin" ? "/admin/dashboard" : "/home";
		return <Navigate to={redirectPath} replace />;
	}
	return (
		<>
		<ScrollToTop/>
			<Outlet />
		</>
	);
};

export default Auth;
