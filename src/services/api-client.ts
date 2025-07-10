import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.SERVER_ENDPOINT || "http://localhost:8080/api",
  withCredentials: true
});

export default apiClient;