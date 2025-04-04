import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { publicRequest } from "../axiosCall";
import { setUser } from "./userReducer";
import Swal from "sweetalert2";

const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  let token = sessionStorage.getItem("accessToken") || Cookies.get("accessToken");

  useEffect(() => {
    const checkLogin = async () => {
      if (!token || user.token) {
        setLoading(false);
        return;
      }
      try {
        const response = await publicRequest.post("/user/check-login", { token });
        if (response.status === 200) {
          dispatch(setUser(response.data));
          Swal.fire({
            icon: "success",
            title: "Welcoming Back",
            text: `Hi! ${response.data.user} , Happy to have you back!!!`,
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          sessionStorage.removeItem("accessToken");
          Cookies.remove("accessToken");
        }
      } catch (error) {
        console.error("Authentication failed:", error);
      }
      setLoading(false);
    };
    checkLogin();
  }, [token, user.token, dispatch]);

  if (loading) return null; // Prevent showing login page briefly before checking auth

  return user?.token || token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
