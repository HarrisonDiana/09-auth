import { nextServer, ApiError } from "./api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

// ---------- NOTES ----------
export type CreateNotePayload = {
  title: string;
  content: string;
  tag: string;
};

export type FetchNotesParams = {
  search?: string;
  tag?: string;
  page?: number;
  perPage?: number;
};

export type FetchNotesResponse = {
  notes: Note[];
  totalPages: number;
};

// create note
export const createNote = async (
  payload: CreateNotePayload
): Promise<Note> => {
  try {
    const { data } = await nextServer.post<Note>("/notes", payload);
    return data;
  } catch (err) {
    const error = err as ApiError;
    throw new Error(error.response?.data?.error || "Create note failed");
  }
};

// fetch single note
export const fetchNoteById = async (id: string): Promise<Note> => {
  try {
    const { data } = await nextServer.get<Note>(`/notes/${id}`);
    return data;
  } catch (err) {
    const error = err as ApiError;
    throw new Error(error.response?.data?.error || "Fetch note failed");
  }
};

// delete note
export const deleteNote = async (id: string): Promise<Note> => {
  try {
    const { data } = await nextServer.delete<Note>(`/notes/${id}`);
    return data;
  } catch (err) {
    const error = err as ApiError;
    throw new Error(error.response?.data?.error || "Delete note failed");
  }
};

// fetch all notes
export const fetchNotes = async (
  params: FetchNotesParams
): Promise<FetchNotesResponse> => {
  const { data } = await nextServer.get<FetchNotesResponse>("/notes", {
    params,
  });

  return data;
};

// ---------- AUTH ----------
export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export type UpdateUserPayload = {
  username: string;
};

// login
export const login = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const { data } = await nextServer.post<User>("/auth/login", {
      email,
      password,
    });

    return data;
  } catch (err) {
    const error = err as ApiError;
    throw new Error(error.response?.data?.error || "Login failed");
  }
};

// register
export const register = async (
  payload: RegisterRequest
): Promise<User> => {
  try {
    const { data } = await nextServer.post<User>("/auth/register", payload);

    return data;
  } catch (err) {
    const error = err as ApiError;
    throw new Error(error.response?.data?.error || "Register failed");
  }
};

// logout
export const logout = async (): Promise<void> => {
  try {
    await nextServer.post("/auth/logout");
  } catch (err) {
    const error = err as ApiError;
    throw new Error(error.response?.data?.error || "Logout failed");
  }
};

// fetch user profile
export const fetchUserProfile = async (): Promise<User> => {
  try {
    const { data } = await nextServer.get<User>("/users/me");
    return data;
  } catch (err) {
    const error = err as ApiError;
    throw new Error(error.response?.data?.error || "Fetch profile failed");
  }
};

// update profile
export const updateUserProfile = async (
  payload: UpdateUserPayload
): Promise<User> => {
  try {
    const { data } = await nextServer.patch<User>("/users/me", payload);

    return data;
  } catch (err) {
    const error = err as ApiError;
    throw new Error(error.response?.data?.error || "Update user failed");
  }
};

// check session
export const checkSession = async (): Promise<{ accessToken?: string }> => {
  try {
    const { data } = await nextServer.get("/auth/session");
    return data;
  } catch (err) {
    const error = err as ApiError;
    throw new Error(error.response?.data?.error || "Session check failed");
  }
};