"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/clientApi";
import type { Note } from "@/types/note";
import css from "@/components/NoteDetails/NoteDetails.module.css";

interface Props {
  id: string;
}

export default function NoteDetailsClient({ id }: Props) {
  const { data: note, isLoading, isError } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id), // ✅ token/cookies handled in clientApi
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading note...</p>;
  if (isError || !note) return <p>Something went wrong</p>;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
          <span className={css.tag}>{note.tag}</span>
        </div>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>
          Created at: {new Date(note.createdAt).toLocaleString()}
        </p>
        <p className={css.date}>
          Updated at: {new Date(note.updatedAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}