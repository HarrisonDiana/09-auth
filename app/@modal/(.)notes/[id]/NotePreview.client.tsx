"use client"

import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import * as React from "react"
import { fetchNoteById } from "@/lib/api/clientApi"
import Modal from "@/components/Modal/Modal"
import css from "./NotePreview.module.css"

interface NotePreviewProps {
  id: string
}

export default function NotePreview({ id }: NotePreviewProps) {
  const router = useRouter()

  const { data: note, isLoading, isError } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  })

  const handleClose = () => router.back()

  if (isLoading) {
    return <Modal onClose={handleClose}>Loading...</Modal>
  }

  if (isError || !note) {
    return <Modal onClose={handleClose}>Error loading note</Modal>
  }

  return (
    <Modal onClose={handleClose}>
      <div className={css.container}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
            <span className={css.tag}>{note.tag}</span>
          </div>

          <p className={css.content}>{note.content}</p>

          {note.createdAt && (
            <p className={css.date}>
              {new Date(note.createdAt).toLocaleDateString()}
            </p>
          )}

          <button className={css.backBtn} onClick={handleClose}>
            ← Back
          </button>
        </div>
      </div>
    </Modal>
  )
}