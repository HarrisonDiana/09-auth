"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { fetchUserProfile, checkSession } from "@/lib/api/clientApi";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { setUser, clearAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isPrivate = pathname.startsWith("/profile") || pathname.startsWith("/notes");

    const validateSession = async () => {
      try {
        await checkSession();
        const user = await fetchUserProfile(); 
        setUser(user);
      } catch {
        clearAuth();
        if (isPrivate) router.push("/sign-in");
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, [pathname, router, setUser, clearAuth]);

  if (loading) return <div>Checking session...</div>;
  return <>{children}</>;
}