import Link from "next/link";
import css from "./SidebarNotes.module.css";

const tags = [
  { name: "All notes", slug: "all" },
  { name: "Todo", slug: "todo" },
  { name: "Work", slug: "work" },
  { name: "Personal", slug: "personal" },
  { name: "Meeting", slug: "meeting" },
  { name: "Shopping", slug: "shopping" },
];

export default function SidebarNotes() {
  return (
    <aside className={css.sidebar}>
      <ul className={css.menuList}>
        {tags.map((tag) => (
          <li key={tag.slug} className={css.menuItem}>
            <Link
              href={`/notes/filter/${tag.slug === "all" ? "All" : tag.slug}`}
              scroll={false}
              className={css.menuLink}
            >
              {tag.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}