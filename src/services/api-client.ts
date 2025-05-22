import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.SERVER_ENDPOINT || "http://localhost:8080",
//   withCredentials: true,
//   headers: {'X-Custom-Header': 'foobar'}
});

export default apiClient;