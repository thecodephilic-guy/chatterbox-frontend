"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SignupCredentials } from "@/lib/types/auth";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import "@/app/i18n";
import authService from "@/services/auth-service";

function SignupForm() {

  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] =
    useState<boolean>(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<SignupCredentials>({
    name: "",
    username: "",
    password: "",
    gender: ""
  });

  return (
    <form className="max-w-md w-full space-y-4 mx-auto">
      <div>
        <Input
          placeholder={t("name")}
          name="name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
        />
      </div>
      <div>
        <Input
          placeholder={t("username")}
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
          placeholder={t("password")}
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
        {t("signUp")}
      </Button>
    </form>
  );
}

export default SignupForm;
