import { UsersResponse } from "@/lib/types/user";
import apiClient from "./api-client";

class User {
  async getLastSeen(userId: string) {
    try {
      const res = await apiClient.get(`/user/lastSeen/${userId}`);
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

  async updateLastSeen() {
    try {
      const res = await apiClient.patch(`/user/lastSeen`);
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

  async fetchNewUsers(cursor?: Date) {
    try {
      const res = await apiClient.get(`/chat/new/users`);
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
