// app/(private routes)/notes/[id]/page.tsx
import NotePreview from "@/components/NotePreview/NotePreview";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNoteById } from "@/lib/api/serverApi"; 
import type { Note } from "@/types/note";

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: { [key: string]: string | string[] | undefined };
};


async function fetchNote(id: string): Promise<Note | null> {
  try {
    return await getNoteById(id); 
  } catch {
    return null;
  }
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params; 
  const note = await fetchNote(id);
  if (!note) notFound();

  const description = note.content.slice(0, 160);

  return {
    title: note.title,
    description,
    openGraph: {
      title: note.title,
      description,
      url: `https://08-zustand-three-rho.vercel.app/notes/${id}`, // ✅ використовуємо id після await
      images: [
        {
          url: "/og-images/note.png",
          width: 1200,
          height: 630,
          alt: note.title,
        },
      ],
      type: "website",
      siteName: "NoteHub",
    },
    twitter: {
      card: "summary_large_image",
      title: note.title,
      description,
      images: ["/og-images/note.png"],
    },
  };
}

export default async function NotePage({ params }: Props) {
  const { id } = await params; 
  const note = await fetchNote(id);
  if (!note) notFound();

  return <NotePreview noteId={note.id} />;
}