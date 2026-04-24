// app/@modal/(.)notes/[id]/page.tsx
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import NotePreview from "./NotePreview.client";
import { getNoteById } from "@/lib/api/serverApi";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{ id: string }>;
};

async function fetchNote(id: string) {
  try {
    return await getNoteById(id);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params; 
  const note = await fetchNote(id);
  if (!note) throw new Error("Note not found");

  return {
    title: note.title,
    description: note.content.slice(0, 160),
    openGraph: {
      title: note.title,
      description: note.content.slice(0, 160),
      url: `/notes/${id}`, 
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: note.title,
        },
      ],
    },
  };
}

export default async function NoteModalPage({ params }: PageProps) {
  const { id } = await params; 
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNote(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreview id={id} />
    </HydrationBoundary>
  );
}