import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getServerMe } from "@/lib/api/serverApi";
import { redirect } from "next/navigation";
import css from "./ProfilePage.module.css";

export const metadata: Metadata = {
  title: "Profile | NoteHub",
  description: "View and manage your profile information on NoteHub.",
};

export default async function ProfilePage() {
  const user = await getServerMe();
  
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar ?? "/default-avatar.png"}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}