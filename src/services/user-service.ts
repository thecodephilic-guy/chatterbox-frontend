import { UsersResponse } from "@/lib/types/user";
import apiClient from "./api-client";
import ensureError from "@/lib/utils/ensureError";
import status from "http-status";

class User {
  async getLastSeen(userId: string) {
    try {
      const res = await apiClient.get(`/user/lastSeen/${userId}`);
      const response: UsersResponse = res.data;
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
      const response: UsersResponse = res.data;
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

  async searchUser(username: string) {
    try {
      const res = await apiClient.get(`/user/search?username=${username}`);
      const response: UsersResponse = res.data;
      if(response.status !== status.OK){
        throw new Error(response.error);
      }
      return response.data;
    } catch (e: any) {
      if (e.response && e.response.data && e.response.data.error) {
        throw new Error(e.response.data.error);
      }
      throw ensureError(e);
    }
  }

  async checkUsername(username: string){
    try{
      const res = await apiClient.get(`/user/isUnique/${username}`);
      const response: UsersResponse = res.data;
      if(response.data !== status.OK){
        throw new Error(response.error);
      }
      return response.data;
    }catch (e: any) {
      if (e.response && e.response.data && e.response.data.error) {
        throw new Error(e.response.data.error);
      }
      throw ensureError(e);
    }
  }
}

const userService = new User();

export default userService;
