import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.SERVER_ENDPOINT,
  withCredentials: true
});

export default apiClient;