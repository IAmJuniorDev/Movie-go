import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { publicRequest } from "../axiosCall";
import { setUser } from "./userReducer";

const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  let token = sessionStorage.getItem("accessToken");

  const checkLogin = async()=>{
    var response = await publicRequest.post();
    if(response.status != 200){
      return null;
    }
    dispatch(setUser(response.data));
  }
  
  if (!token) {
    token = Cookies.get("accessToken");
  }
  if(!token&&user.token ===""){
    checkLogin();
  }

  return user?.token || token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
