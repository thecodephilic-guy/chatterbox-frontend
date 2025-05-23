'use client'

import { useState } from "react";
import React from 'react'
import LoginForm from "@/components/auth/login-form";
import { LoginCredentials, AuthResponse, FailedAuthResponse } from "@/lib/types/auth";
import authService from "@/services/auth-service";
import { useRouter } from "next/navigation";
import status from "http-status";

function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleFormSubmit = async (data: LoginCredentials) => {
    setLoading(true);
    try {
      const response = await authService.login(data) as AuthResponse & FailedAuthResponse;
      if (response.status === status.OK) {
        router.push("/chats");
      } else {
        setError(response.error);
      }
    } catch (error: any) {
      setError(error?.message || "An error occurred!");
    }
    setLoading(false);
  }
  
  return (
    <LoginForm onSubmit={handleFormSubmit} loading={loading} error={error} />
  )
}

export default Login