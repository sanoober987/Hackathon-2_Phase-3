"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/hooks/useAuth";
import { ToastProvider, useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/ui/Toast";

interface ProvidersProps {
  children: ReactNode;
}

// Wrapper to render the toast container alongside the app
function ToastWrapper({ children }: { children: ReactNode }) {
  const { toasts, removeToast } = useToast();

  return (
    <>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </>
  );
}

// Main providers component to wrap the app
export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <ToastProvider>
        <ToastWrapper>{children}</ToastWrapper>
      </ToastProvider>
    </AuthProvider>
  );
}
