import { Navigate, Outlet, useLocation } from "react-router-dom";
// import useAuth from "../hooks/useAuth";
import authService from "../apiServices/auth.service";

const RequireAuth = () => {
  const location = useLocation();
  const auth = authService.isLoggedIn();

  //   console.log(auth);
  return auth ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in" state={{ from: location }} replace />
  );
};

export default RequireAuth;
