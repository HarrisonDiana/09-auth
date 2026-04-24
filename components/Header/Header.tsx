import Link from "next/link";
import TagsMenu from "@/components/TagsMenu/TagsMenu";
import AuthNavigation from "@/components/AuthNavigation/AuthNavigation";
import css from "./Header.module.css";

interface Tag {
  name: string;
  slug: string;
}

const tags: Tag[] = [
  { name: "All notes", slug: "all" },
  { name: "Todo", slug: "Todo" },
  { name: "Work", slug: "Work" },
  { name: "Personal", slug: "Personal" },
  { name: "Meeting", slug: "Meeting" },
  { name: "Shopping", slug: "Shopping" },
  { name: "Ideas", slug: "Ideas" },
  { name: "Travel", slug: "Travel" },
  { name: "Finance", slug: "Finance" },
  { name: "Health", slug: "Health" },
  { name: "Important", slug: "Important" },
];

export default function Header() {
  return (
    <header className={css.header}>
      <div className={css.logo}>
        <Link href="/" aria-label="Home">
          NoteHub
        </Link>
      </div>

      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <TagsMenu tags={tags} />
          </li>
          <li>
            <AuthNavigation />
          </li>
        </ul>
      </nav>
    </header>
  );
}