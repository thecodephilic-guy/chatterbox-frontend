import apiClient from "./api-client";

class User {
  async getLastSeen(id: string | undefined) {
    try {
      const response = await apiClient.get(`/users/get-user/${id}`);
      
      return response.data.data.lastSeen;
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
