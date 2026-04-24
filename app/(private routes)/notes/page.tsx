"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import { SearchBox } from "@/components/SearchBox/SearchBox";
import { fetchNotes, FetchNotesResponse } from "@/lib/api/clientApi";
import css from "./NotesPage.module.css";

export default function NotesPage() {
  const router = useRouter();
  const perPage = 12;

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery<FetchNotesResponse, Error>({
    queryKey: ["notes", page, search],
    queryFn: () =>
      fetchNotes({ page, perPage, search, tag: "" }), // пустий тег = всі нотатки
    placeholderData: {
      notes: [],
      totalPages: 1,
    },
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  return (
    <main className={css.mainContent}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            activePage={page}
            onPageChange={setPage}
          />
        )}
        <button
          className={css.createButton}
          onClick={() => router.push("/notes/action/create")}
        >
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading notes...</p>}
      {isError && <p>Error loading notes</p>}
      {!isLoading && notes.length === 0 && <p>No notes found.</p>}

      {notes.length > 0 && <NoteList notes={notes} />}
    </main>
  );
}