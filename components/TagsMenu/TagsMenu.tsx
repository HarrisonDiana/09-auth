"use client";

import { useState } from "react";
import Link from "next/link";
import css from "./TagsMenu.module.css";

type Tag = { name: string; slug: string };

type Props = {
  tags: Tag[];
};

export default function TagsMenu({ tags }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className={css.menuContainer}>
      <button
        className={css.menuButton}
        onClick={() => setOpen(prev => !prev)}
      >
        Notes ▾
      </button>

      {open && (
        <ul className={css.menuList}>
          {tags.map(tag => (
            <li key={tag.slug} className={css.menuItem}>
              <Link
                href={`/notes/filter/${tag.slug === "all" ? "all" : tag.slug}`}
                className={css.menuLink}
                onClick={() => setOpen(false)} // close menu on selection
              >
                {tag.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}