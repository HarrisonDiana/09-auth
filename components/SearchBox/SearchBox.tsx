import css from "./SearchBox.module.css";


export interface SearchBoxProps {
  value: string;
  onChange: (val: string) => void;
}

export function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
      <input className={css.input}
      placeholder="Search notes"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}