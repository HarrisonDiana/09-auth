// app/notes/page.tsx
import css from "./page.module.css";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Home - NoteHub",
    description:
      "NoteHub is a simple and efficient application for managing personal notes. Organize your thoughts and access them anywhere.",
    keywords: ["notes", "productivity", "NoteHub", "organization", "personal notes"],
    openGraph: {
      title: "Home - NoteHub",
      description:
        "NoteHub is a simple and efficient application for managing personal notes. Organize your thoughts and access them anywhere.",
      url: "https://07-routing-nextjs-mu-six.vercel.app/notes/filter/all",
      siteName: "NoteHub",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Home - NoteHub",
      description:
        "NoteHub is a simple and efficient application for managing personal notes. Organize your thoughts and access them anywhere.",
    },
  };
}

export default function Home() {
  return (
    <div className={css.page}>
      <main>
        <div className={css.container}>
          <h1 className={css.title}>Welcome to NoteHub</h1>
          <p className={css.description}>
            NoteHub is a simple and efficient application designed for managing
            personal notes. It helps keep your thoughts organized and accessible
            in one place, whether you are at home or on the go.
          </p>
          <p className={css.description}>
            The app provides a clean interface for writing, editing, and browsing
            notes. With support for keyword search and structured organization,
            NoteHub offers a streamlined experience for anyone who values clarity
            and productivity.
          </p>
        </div>
      </main>
    </div>
  );
}