"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SignupCredentials } from "@/lib/types/auth";
import { Eye, EyeOff, Loader2Icon } from "lucide-react";

interface SignupProps {
  onSubmit: (data: SignupCredentials) => void;
  loading?: boolean;
  error?: string | null;
}

function SignupForm({ onSubmit, loading, error }: SignupProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
  const [formData, setFormData] = useState<SignupCredentials>({
    name: "",
    username: "",
    password: "",
    gender: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="max-w-md w-full space-y-4 mx-auto" onSubmit={handleSubmit}>
      <div>
        <Input
          placeholder="Name"
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div>
        <Input
          placeholder="Username"
          name="username"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          available={isUsernameAvailable}
          error={error}
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

      <Select
        value={formData.gender}
        onValueChange={(value) => setFormData({ ...formData, gender: value })}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Gender" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="male">Male</SelectItem>
          <SelectItem value="female">Female</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>

      <Button className="w-full" size="lg" type="submit">
        {loading ? <Loader2Icon /> : "SignUp"}
      </Button>
    </form>
  );
}

export default SignupForm;
