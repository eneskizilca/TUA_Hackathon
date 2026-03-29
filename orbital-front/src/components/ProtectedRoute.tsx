"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("OBSERVER" | "OPERATOR" | "ADMIN")[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/auth/login");
        return;
      }

      if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on role
        if (user.role === "ADMIN") {
          router.push("/dashboard/admin");
        } else if (user.role === "OPERATOR") {
          router.push("/dashboard/operator");
        } else {
          router.push("/dashboard/observer");
        }
      }
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050607] flex flex-col items-center justify-center text-[#7be1ea] font-mono gap-4 tracking-widest uppercase text-sm">
        <div className="w-8 h-8 rounded-full border-2 border-[#7be1ea] border-t-transparent animate-spin" />
        AUTHENTICATING...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
