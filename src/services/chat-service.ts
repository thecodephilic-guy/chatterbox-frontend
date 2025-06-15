import apiClient from "./api-client";

class Chat {
  async getAllChats() {
    try {
      const response = await apiClient.get(`/chats/all`);
      return response.data;
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

  async getMessages(){
    
  }
}

const chatService = new Chat();

export default chatService;