import axios from "axios";
import { useAuthStore } from "@/store/auth-store";

const apiClient = axios.create({
  baseURL: process.env.SERVER_ENDPOINT || "http://localhost:8080/api",
});
// Add request interceptor
apiClient.interceptors.request.use(
  (config) => {    
    // Define which routes should NOT have the token
    const openRoutes = ["/auth/login", "/auth/signup"];

    // If the current request path is not in openRoutes, attach the token
    const shouldAttachToken = !openRoutes.some((route) =>
      config.url?.includes(route)
    ); 

    if (shouldAttachToken) {
      const token = useAuthStore.getState().token;      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export default apiClient;