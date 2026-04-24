import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Notes from "./Notes.client";
import { getNotes } from "@/lib/api/serverApi";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = Promise<{ params: { slug: string[] } }>;

const allowedTags = [
  "Todo", "Work", "Personal", "Meeting", "Shopping",
  "Ideas", "Travel", "Finance", "Health", "Important", "All"
];

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { params } = await props;
  const rawTag = params.slug?.[0] ?? "All";
  const tagName = rawTag.toLowerCase() === "all" ? "All Notes" : rawTag;
  return {
    title: `NoteHub - ${tagName}`,
    description: `Browse ${tagName} in NoteHub, your efficient personal note manager.`,
  };
}

export default async function FilteredNotesPage(props: Props) {
  const { params } = await props;
  const rawTag = params.slug?.[0] ?? "All";

  const validTag = allowedTags.find(
    (t) => t.toLowerCase() === rawTag.toLowerCase()
  );
  if (!validTag) notFound();

  const tag = validTag === "All" ? "" : validTag;
  const perPage = 12;
  const initialPage = 1;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", initialPage, "", tag],
    queryFn: () =>
      getNotes({
        page: initialPage,
        perPage,
        search: undefined,
        tag: tag || undefined,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Notes tag={tag} />
    </HydrationBoundary>
  );
}