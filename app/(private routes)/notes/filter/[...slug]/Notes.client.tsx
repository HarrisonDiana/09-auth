"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/navigation";
import Link from "next/link";
import css from "./NotesPage.module.css";
import { fetchNotes, FetchNotesResponse } from "@/lib/api/clientApi";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import { SearchBox } from "@/components/SearchBox/SearchBox";
import { useAuthStore } from "@/lib/store/authStore";

type NotesProps = { tag: string };

export default function Notes({ tag }: NotesProps) {
  const router = useRouter();
  const perPage = 12;

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [page, setPage] = useState(1);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) router.push("/sign-in");
  }, [isAuthenticated, router]);

  const { data, isLoading, isError } = useQuery<FetchNotesResponse, Error>({
    queryKey: ["notes", page, debouncedSearch, tag],
    queryFn: () =>
      fetchNotes({
        page,
        perPage,
        search: debouncedSearch || undefined,
        tag: tag === "all" ? undefined : tag,
      }),
    enabled: isAuthenticated, // fetch only if logged in
    placeholderData: { notes: [], totalPages: 1 },
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  if (!isAuthenticated) return <p>Redirecting to login...</p>;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />

        {totalPages > 1 && (
          <Pagination totalPages={totalPages} activePage={page} onPageChange={setPage} />
        )}

        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      {isLoading && <p>Loading notes...</p>}
      {isError && <p>Error loading notes</p>}
      {!isLoading && notes.length === 0 && <p>No notes found.</p>}
      {notes.length > 0 && <NoteList notes={notes} />}
    </div>
  );
}