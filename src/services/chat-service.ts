import { ChatResponse } from "@/lib/types/chat";
import apiClient from "./api-client";
import ensureError from "@/lib/utils/ensureError";
import status from "http-status";

class Chat {
  async getAllChats() {
    try {
      const response = await apiClient.get(`/chat/user`);
      const data: ChatResponse = response.data;

      if (data.status !== status.OK) {
        throw new Error(data.error);
      }
      return response.data;
    } catch (e: any) {
      if (e.response && e.response.data && e.response.data.error) {
        throw new Error(e.response.data.error);
      }
      throw ensureError(e);
    }
  }
  

  async getConversation(
    chatId: string | undefined,
    cursor?: Date | null,
    limit: number = 20
  ) {
    const params: any = { limit };
    if (cursor) params.cursor = cursor;

    try {
      if (!chatId) {
        throw new Error("No chatId provided!");
      }
      const response = await apiClient.get(`/message/conversation/${chatId}`, {
        params,
      });
      const data: ChatResponse = response.data;

      if (data.status !== status.OK) {
        throw new Error(data.error);
      }

      return data;
    } catch (e: any) {
      if (e.response && e.response.data && e.response.data.error) {
        throw new Error(e.response.data.error);
      }
      throw ensureError(e);
    }
  }


  async markMessagesRead(chatId: string | undefined) {
    try {
      if (!chatId) {
        throw new Error("No chatId provided!");
      }
      const res = await apiClient.patch(`/message/isRead`, { chatId });
      return res.data;
    } catch (e: any) {
      if (e.response && e.response.data && e.response.data.error) {
        throw new Error(e.response.data.error);
      }
      throw ensureError(e);
    }
  }
}

const chatService = new Chat();

export default chatService;
