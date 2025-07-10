"use client";

import React, { useEffect } from "react";
import SignupForm from "@/components/auth/singup-form";
import Link from "next/link";
import authService from "@/services/auth-service";
import { SignupCredentials, AuthResponse } from "@/lib/types/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";

export default function SignupPage() {
  const { setAuthError, authError, loading, setLoading, setAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
  if (authError) {
    toast.dismiss();
    toast.error(authError);
    setAuthError(null); 
  }
}, [authError]);

  const handleFormSubmit = async (data: SignupCredentials) => {
    setLoading(true);
    try {
      const response = (await authService.signUp(data)) as AuthResponse;
      setAuth(response.data);
      router.push("/chats");
    } catch (err: any) {
      setAuthError(err.message);
    }finally{
      setLoading(false);
    }
  };

  return (
    <>
      <SignupForm
        onSubmit={handleFormSubmit}
        loading={loading}
        error={authError}
      />
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
