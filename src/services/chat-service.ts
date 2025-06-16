import { MessageResponse } from "@/lib/types/chat";
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

  async getMessages(chatId: string | undefined){
    try{
      if(!chatId){
      throw new Error("No chat Id");
      }

      const res = await apiClient.get(`/messages/${chatId}`);
      const response: MessageResponse = res.data;
      
      return response;
    }
    catch (error: unknown) {
      interface ErrorResponse {
        response?: {
          data?: unknown;
        };
      }

      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        (error as ErrorResponse).response &&
        typeof (error as ErrorResponse).response === "object" &&
        "data" in (error as ErrorResponse).response!
      ) {
        return (error as ErrorResponse).response!.data;
      }
      return { message: "An unknown error occurred." };
        }
  }
}

const chatService = new Chat();

export default chatService;