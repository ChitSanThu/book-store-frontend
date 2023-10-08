import axios from "axios";
import Cookies from "js-cookie";
const API_URL = import.meta.env.VITE_API_URL;

const API = axios.create({baseURL: API_URL});

API.interceptors.request.use((req) => {
    if (Cookies.get("token")) {
      req.headers.Authorization = `Bearer ${Cookies.get("token")}`;
    }
    return req;
  });

export default API