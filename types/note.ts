export type Note = {
  id: string;
  title: string;
  content: string;
  tag: Tag;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type Tag =
  | "Todo"
  | "Work"
  | "Personal"
  | "Meeting"
  | "Shopping"
  | "Ideas"
  | "Travel"
  | "Finance"
  | "Health"
  | "Important";

export type CreateNotePayload = {
  title: string;
  content: string;
  tag: Tag;
};