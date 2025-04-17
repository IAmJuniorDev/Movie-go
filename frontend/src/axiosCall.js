import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const publicRequest = axios.create({
  baseURL: BASE_URL
});

export const userRequest = axios.create({
  baseURL: BASE_URL
});

userRequest.interceptors.request.use(
  (config) => {
    let TOKEN = sessionStorage.getItem("accessToken");
    if (!TOKEN) {
      TOKEN = Cookies.get("accessToken");
    }
    if (TOKEN) {
      config.headers.Authorization = `Bearer ${TOKEN}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);