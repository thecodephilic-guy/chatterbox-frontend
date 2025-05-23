import apiClient from "./api-client";
import { SignupCredentials, LoginCredentials, AuthResponse } from "@/lib/types/auth";

class Auth {
  async signUp(credentials: SignupCredentials) {
    try {
      const response : AuthResponse = await apiClient.post("/auth/signup/", credentials);

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

  async login(credentials: LoginCredentials) {
    try {
      const response : AuthResponse = await apiClient.post("/auth/login/", credentials);
        
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

//   async logout(){

//   }
//   async getCurrentUser(){

//   }
//   async resetPassword(){

//   }
}

const authService = new Auth();

export default authService;
