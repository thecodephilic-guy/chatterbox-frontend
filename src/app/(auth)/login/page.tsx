"use client";

import { useEffect } from "react";
import React from "react";
import LoginForm from "@/components/auth/login-form";
import { LoginCredentials, AuthResponse } from "@/lib/types/auth";
import authService from "@/services/auth-service";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";

function Login() {
  const { setAuth, loading, setLoading, authError, setAuthError } =
    useAuthStore();

  const router = useRouter();

 useEffect(() => {
  if (authError) {
    toast.dismiss();
    toast.error(authError);
    setAuthError(null); 
  }
}, [authError]);

  const handleFormSubmit = async (data: LoginCredentials) => {
    setLoading(true);
    try {
      const response = (await authService.login(data)) as AuthResponse;
      setAuth(response.data);
      toast.success("Login Successfull!")
      router.push("/chats");
    } catch (err) {      
      setAuthError((err as Error).message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginForm
      onSubmit={handleFormSubmit}
      loading={loading}
      error={authError}
    />
  );
}

export default Login;
