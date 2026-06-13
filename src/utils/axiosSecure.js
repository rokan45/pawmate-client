import axios from "axios";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL || "http://localhost:5000",
  withCredentials: true,
});

export default axiosSecure;
