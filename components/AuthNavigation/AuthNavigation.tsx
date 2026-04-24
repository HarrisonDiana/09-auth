"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/store/authStore";
import { logout as apiLogout } from "@/lib/api/clientApi";
import css from "./AuthNavigation.module.css";
import { useRouter } from "next/navigation";

export default function AuthNavigation() {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await apiLogout();
    clearAuth();
    router.push("/sign-in");
  };

  return (
    <ul className={css.navigation}>
      {isAuthenticated ? (
        <>
          <li className={css.navigationItem}>
            <Link href="/profile" className={css.navigationLink}>
              Profile
            </Link>
          </li>
          <li className={css.navigationItem}>
            <p className={css.userEmail}>{user?.email}</p>
            <button className={css.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          </li>
        </>
      ) : (
        <>
          <li className={css.navigationItem}>
            <Link href="/sign-in" className={css.navigationLink}>
              Login
            </Link>
          </li>
          <li className={css.navigationItem}>
            <Link href="/sign-up" className={css.navigationLink}>
              Sign up
            </Link>
          </li>
        </>
      )}
    </ul>
  );
}