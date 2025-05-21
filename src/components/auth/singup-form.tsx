"use client"

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SignupCredentials } from "@/lib/types/auth";
import { useState } from "react";

function SignupForm() {
  const [formData, setFormData] = useState<SignupCredentials>({
    username: "",
    password: "",
  });

  return (
    <>
      <Input placeholder="Username" name="username" />{" "}
      {/* if available is true then pass no error else pass error */}
      <Input placeholder="Password" name="password" type="password" />
      <Button className="w-full" size="lg">
        Sign Up
      </Button>
    </>
  );
}

export default SignupForm;
