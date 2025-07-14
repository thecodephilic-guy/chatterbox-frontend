import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_ENDPOINT,
  withCredentials: true
});

export default apiClient;