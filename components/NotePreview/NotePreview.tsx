"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchNoteById } from "@/lib/api/clientApi";
import Modal from "@/components/Modal/Modal";

type Props = {
  noteId: string;
};

export default function NotePreview({ noteId }: Props) {
  const router = useRouter();

  const { data: note, isLoading, isError } = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
  });

  const handleClose = () => {
    router.back();
  };

  if (isLoading) return <Modal onClose={handleClose}>Loading...</Modal>;
  if (isError || !note) return <Modal onClose={handleClose}>Error loading note</Modal>;

  return (
    <Modal onClose={handleClose}>
      <h2>{note.title}</h2>
      <p>{note.content}</p>
      <p>Tag: {note.tag}</p>
    </Modal>
  );
}