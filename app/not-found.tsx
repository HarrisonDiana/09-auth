import css from "./not-found.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found | NoteHub",
  description: "Sorry, the page you are looking for does not exist on NoteHub.",
  openGraph: {
    title: "404 - Page Not Found | NoteHub",
    description: "Sorry, the page you are looking for does not exist on NoteHub.",
    url: "https://08-zustand-three-rho.vercel.app/not-found",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub 404 Page Not Found",
      },
    ],
    type: "website",
    siteName: "NoteHub",
  },
  twitter: {
    card: "summary_large_image",
    title: "404 - Page Not Found | NoteHub",
    description: "Sorry, the page you are looking for does not exist on NoteHub.",
    images: ["https://ac.goit.global/fullstack/react/notehub-og-meta.jpg"],
  },
};

export default function NotFoundPage() {
  return (
    <div className={css.wrapper}>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </div>
  );
}