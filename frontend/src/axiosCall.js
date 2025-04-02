import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const publicRequest = axios.create({
  baseURL: BASE_URL
});

export const userRequest = async() => {
  // const TOKEN = await JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.accessToken;
  let TOKEN = sessionStorage.getItem("accessToken");
  if(!TOKEN){
    TOKEN = Cookies.get("accessToken");
  }
  return axios.create({
    baseURL: BASE_URL,
    headers: { Authorization: `Bearer ${TOKEN}` }
  });
};