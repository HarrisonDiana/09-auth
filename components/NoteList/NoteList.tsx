"use client";

import css from "./NoteList.module.css";
import type { Note } from "@/types/note";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/lib/api/clientApi";

type NoteListProps = {
  notes: Note[];
  onNoteClick?: (note: Note) => void;
};

export default function NoteList({ notes, onNoteClick }: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"], exact: false });
    },
  });

  return (
    <div className={css.list}>
      {notes.map((note) => (
        <div key={note.id} className={css.item}>
          {/* 👆 Перехід на сторінку нотатки */}
          <Link href={`/notes/${note.id}`} className={css.link}>
            <h3 className={css.title}>{note.title}</h3>
            <p className={css.content}>{note.content}</p>
            {note.tag && <span className={css.tag}>{note.tag}</span>}
            {note.createdAt && (
              <p className={css.date}>
                {new Date(note.createdAt).toISOString().split("T")[0]}
              </p>
            )}
          </Link>

          {/* 🗑 Кнопка видалення нотатки */}
          <button
            className={css.deleteButton}
            onClick={() => deleteMutation.mutate(note.id)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </button>

          {/* Додатковий onNoteClick, якщо потрібен */}
          {onNoteClick && (
            <button className={css.viewButton} onClick={() => onNoteClick(note)}>
              View
            </button>
          )}
        </div>
      ))}
    </div>
  );
}