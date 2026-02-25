"use client";

import { useRedirectIfAuthenticated } from "@/hooks/useAuth";
import { SignUpForm } from "@/components/auth/SignUpForm";

export default function SignupPage() {
  useRedirectIfAuthenticated();

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      <section
        aria-labelledby="signup-title"
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 space-y-6">
          <header className="text-center space-y-2">
            <h1
              id="signup-title"
              className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100"
            >
              Create Account
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Sign up to start managing your tasks
            </p>
          </header>

          <div>
            <SignUpForm />
          </div>
        </div>
      </section>
    </main>
  );
}
