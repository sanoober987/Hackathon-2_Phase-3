"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { isValidEmail } from "@/lib/utils";

interface SignInFormData {
  email: string;
  password: string;
}

export function LoginForm() {
  const { signIn, isLoading, error, clearError } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (data: SignInFormData) => {
    setSubmitError(null);
    clearError();

    try {
      await signIn(data.email, data.password);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign in failed";
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
        placeholder="Enter your password"
        autoComplete="current-password"
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

      <Button type="submit" fullWidth isLoading={disabled}>
        Sign In
      </Button>

      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
