"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import css from "./EditProfilePage.module.css";
import { useAuthStore } from "@/lib/store/authStore";
import { updateUserProfile } from "@/lib/api/clientApi";

export default function ProfileEditPage() {
  const router = useRouter();

  const { user, setUser } = useAuthStore((state) => ({
    user: state.user,
    setUser: state.setUser,
  }));

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ исправленный useEffect
  useEffect(() => {
    if (!user) return;

    const timer = setTimeout(() => {
      setUsername(user.username);
    }, 0);

    return () => clearTimeout(timer);
  }, [user]);

  // ✅ защита пока user не загрузился
  if (!user) return <p>Loading profile...</p>;

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const updatedUser = await updateUserProfile({ username });
      setUser(updatedUser);
      router.push("/profile");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar ?? "/default-avatar.png"}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <form className={css.profileInfo} onSubmit={handleSave}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <p>Email: {user.email}</p>

          {error && <p className={css.error}>{error}</p>}

          <div className={css.actions}>
            <button type="submit" className={css.saveButton} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}