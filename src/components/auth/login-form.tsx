"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoginCredentials } from "@/lib/types/auth";
import { Eye, EyeOff } from "lucide-react";
import { Loader2Icon } from "lucide-react";

interface LoginProps {
  onSubmit: (data: LoginCredentials) => void;
  loading?: boolean;
  error?: string | null;
}

function LoginForm(props: LoginProps) {

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginCredentials>({
    username: "",
    password: "",
  });

  const { onSubmit, loading, error } = props;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  return (
    <>
      <form
        className="max-w-md w-full space-y-4 mx-auto"
        onSubmit={handleSubmit}
      >
        <div>
          <Input
            placeholder="Username"
            name="username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
        </div>

        <div className="relative">
          <Input
            placeholder="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            className="pr-2"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <Button
            variant="ghost"
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </Button>
        </div>
        <Button className="w-full" size="lg" type="submit">
          {loading ? <Loader2Icon /> : "Login"}
        </Button>
      </form>
    </>
  );
}

export default LoginForm;
