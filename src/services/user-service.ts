import { UsersResponse } from "@/lib/types/user";
import apiClient from "./api-client";


interface lastSeenResponse {
  lastSeen : Date | null;
}

class User {
  async getLastSeen(id: string | undefined) {
    try {
      const res = await apiClient.get(`/users/last-seen/${id}`);
      const response : lastSeenResponse = res.data;
      return response;
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response
      ) {
        return error.response.data;
      }
      return { message: "An unknown error occurred." };
    }
  }

  async getAllUsers() {
    try {
      const res = await apiClient.get(`/users/all/`);
      const response : UsersResponse = res.data;
      return response;
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response
      ) {
        return error.response.data;
      }
      return { message: "An unknown error occurred." };
    }
  }
}

const userService = new User();

export default userService;
