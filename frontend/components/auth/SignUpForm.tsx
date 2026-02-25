"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { isValidEmail } from "@/lib/utils";

interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export function SignUpForm() {
  const { signUp, isLoading, error, clearError } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  const password = watch("password");

  const onSubmit = async (data: SignUpFormData) => {
    setSubmitError(null);
    clearError();

    try {
      await signUp(data.email, data.password);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign up failed";
      setSubmitError(message);
    }
  };

  const displayError = submitError || error;
  const disabled = isLoading || isSubmitting;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      noValidate
      aria-busy={disabled}
    >
      {displayError && (
        <div
          role="alert"
          className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg"
        >
          {displayError}
        </div>
      )}

      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        disabled={disabled}
        error={errors.email?.message}
        {...register("email", {
          required: "Email is required",
          onChange: () => clearError(),
          validate: (value) =>
            isValidEmail(value) || "Please enter a valid email",
        })}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Create a password"
        helperText="Must be at least 8 characters"
        autoComplete="new-password"
        disabled={disabled}
        error={errors.password?.message}
        {...register("password", {
          required: "Password is required",
          onChange: () => clearError(),
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters",
          },
        })}
      />

      <Input
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        autoComplete="new-password"
        disabled={disabled}
        error={errors.confirmPassword?.message}
        {...register("confirmPassword", {
          required: "Please confirm your password",
          onChange: () => clearError(),
          validate: (value) =>
            value === password || "Passwords do not match",
        })}
      />

      <Button type="submit" fullWidth isLoading={disabled}>
        Create Account
      </Button>

      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
