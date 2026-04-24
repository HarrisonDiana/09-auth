"use client";

import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import css from "./NoteForm.module.css";
import { useNoteStore } from "@/lib/store/noteStore";
import { createNote } from "@/lib/api/clientApi";
import type { CreateNotePayload } from "@/lib/api/clientApi";
import type { Note } from "@/types/note";

export default function NoteForm() {
  const { draft, saveDraft, clearDraft } = useNoteStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const title = draft?.title ?? "";
  const content = draft?.content ?? "";
  const tag = (draft?.tag as CreateNotePayload["tag"]) ?? "Todo";

  // ✅ Мутація з очищенням draft у onSuccess
  const createMutation = useMutation({
    mutationFn: (payload: CreateNotePayload) => createNote(payload),
    onSuccess: (created: Note) => {
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ["notes"], exact: false });
      router.push(`/notes/${created.id}`);
    },
  });

  const handleChange = (field: keyof CreateNotePayload, value: string) => {
    saveDraft({ ...draft, [field]: value });
  };

  const validate = () => {
    if (title.trim().length < 3 || title.trim().length > 50) {
      alert("Title must be 3-50 characters long");
      return false;
    }
    if (content.trim().length > 500) {
      alert("Content must be at most 500 characters long");
      return false;
    }
    if (!tag) {
      alert("Tag is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: CreateNotePayload = {
      title: title.trim(),
      content: content.trim(),
      tag,
    };

    createMutation.mutate(payload);
  };

  return (
    <form className={css.form} onSubmit={handleSubmit} noValidate>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => handleChange("title", e.target.value)}
          className={css.input}
          required
          minLength={3}
          maxLength={50}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          placeholder="Content"
          value={content}
          onChange={(e) => handleChange("content", e.target.value)}
          className={css.textarea}
          maxLength={500}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          value={tag}
          onChange={(e) => handleChange("tag", e.target.value as CreateNotePayload["tag"])}
          className={css.select}
          required
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={() => router.back()}>
          Cancel
        </button>
        <button type="submit" className={css.submitButton} disabled={createMutation.isPending}>
          {createMutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}