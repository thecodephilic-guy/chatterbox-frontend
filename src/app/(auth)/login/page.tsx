"use client";

import { useEffect, useState } from "react";
import React from "react";
import LoginForm from "@/components/auth/login-form";
import {
  LoginCredentials,
  AuthResponse,
  FailedAuthResponse,
} from "@/lib/types/auth";
import authService from "@/services/auth-service";
import { useRouter } from "next/navigation";
import status from "http-status";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import { stat } from "fs";

function Login() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setError = useAuthStore((state) => state.setError);
  const authError = useAuthStore((state) => state.error);

  useEffect(() => {
    if (authError) {
      toast.dismiss(); // Dismiss any previous toasts
      toast(authError);
    }
    return () => {
      setError("");
    };
  });

  const router = useRouter();

  const handleFormSubmit = async (data: LoginCredentials) => {
    setLoading(true);
    try {
      const response = (await authService.login(data)) as AuthResponse &
        FailedAuthResponse;
      if (response.status === status.OK) {
        setAuth(response.data, response.token);
        router.push("/chats");
      } else {
        setError(response.error);
      }
    } catch (error: any) {
      setError(error?.message || "An error occurred!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginForm
      onSubmit={handleFormSubmit}
      loading={useAuthStore((state) => state.loading)}
      error={useAuthStore((state) => state.error)}
    />
  );
}

export default Login;
