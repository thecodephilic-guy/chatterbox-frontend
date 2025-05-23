'use client'

import React, {useState} from "react";
import SignupForm from "@/components/auth/singup-form"
import Link from "next/link";
import authService from "@/services/auth-service";
import { SignupCredentials, AuthResponse , FailedAuthResponse} from "@/lib/types/auth";
import status from "http-status";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFormSubmit = async (data : SignupCredentials) => {
    setLoading(true);
    try {
      const response = await authService.signUp(data) as AuthResponse & FailedAuthResponse;
      if (response.status === status.CREATED) {
        router.push("/chats");
      } else {
        setError(response.error);
      }
    } catch (error: any) {
      setError(error?.message || "An error occurred!");
    }
    setLoading(false);
  };
  
  return (
    <>
      <SignupForm onSubmit={handleFormSubmit} loading={loading} error={error}/>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500 underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </>
  );
}
