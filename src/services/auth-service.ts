import status from "http-status";
import apiClient from "./api-client";
import {
  SignupCredentials,
  LoginCredentials,
  AuthResponse,
} from "@/lib/types/auth";
import ensureError from "@/lib/utils/ensureError";

class Auth {
  async signUp(credentials: SignupCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post("/auth/signup", credentials);
      const data: AuthResponse = response.data;

      if (data.status !== status.CREATED) {
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

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post("/auth/login", credentials);
      const data: AuthResponse = response.data;

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

  //   async logout(){

  //   }
  //   async resetPassword(){

  //   }
}

const authService = new Auth();

export default authService;
