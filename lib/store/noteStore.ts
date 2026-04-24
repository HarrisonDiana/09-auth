import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Draft {
  title: string;
  content: string;
  tag: string;
}

interface NoteStore {
  draft: Draft;
  saveDraft: (note: Partial<Draft>) => void;
  clearDraft: () => void;
}

const initialDraft: Draft = {
  title: "",
  content: "",
  tag: "Todo",
};

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      saveDraft: (note) =>
        set((state) => ({ draft: { ...state.draft, ...note } })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "note-draft",
    }
  )
);