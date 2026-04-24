"use server";

import { cookies } from "next/headers";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { nextServer } from "./api";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";

// ✅ Response type for session check
export interface SessionResponse {
  accessToken?: string;
  refreshToken?: string;
}

// =========================
// 🍪 Cookies helper
// =========================
async function getRequestCookieHeader(): Promise<string | undefined> {
  try {
    const cookieStore = await cookies();
    const all = cookieStore.getAll();
    if (!all || all.length === 0) return undefined;
    return all.map((c) => `${c.name}=${c.value}`).join("; ");
  } catch {
    return undefined;
  }
}

// =========================
// 🌐 HTTP helpers
// =========================
async function withCookies<T>(
  method: "get" | "post" | "put" | "delete",
  url: string,
  options?: { data?: unknown; config?: AxiosRequestConfig }
): Promise<AxiosResponse<T>> {
  const cookieHeader = await getRequestCookieHeader();
  return nextServer.request<T>({
    method,
    url,
    data: options?.data,
    ...options?.config,
    headers: {
      ...(options?.config?.headers ?? {}),
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    withCredentials: true,
  });
}

const serverGet = <T>(url: string, config?: AxiosRequestConfig) =>
  withCookies<T>("get", url, { config });

const serverPost = <T>(url: string, data: unknown, config?: AxiosRequestConfig) =>
  withCookies<T>("post", url, { data, config });

const serverPut = <T>(url: string, data: unknown, config?: AxiosRequestConfig) =>
  withCookies<T>("put", url, { data, config });

const serverDelete = <T>(url: string, config?: AxiosRequestConfig) =>
  withCookies<T>("delete", url, { config });

// =========================
// 🔒 AUTH / SESSION
// =========================
export const checkSession = async (): Promise<AxiosResponse<SessionResponse>> =>
  serverGet<SessionResponse>("/auth/session");

export const getUserProfile = async (): Promise<User> => {
  const res = await serverGet<User>("/users/me");
  return res.data;
};

export const getServerMe = async (): Promise<User | null> => {
  try {
    return await getUserProfile();
  } catch {
    return null;
  }
};

// =========================
// 📝 NOTES
// =========================
export const getNoteById = async (id: string): Promise<Note> => {
  const res = await serverGet<Note>(`/notes/${id}`);
  return res.data;
};

export const createNote = async (payload: Note): Promise<Note> => {
  const res = await serverPost<Note>("/notes", payload);
  return res.data;
};

export const updateNote = async (id: string, payload: Note): Promise<Note> => {
  const res = await serverPut<Note>(`/notes/${id}`, payload);
  return res.data;
};

export const deleteNote = async (id: string): Promise<void> => {
  await serverDelete(`/notes/${id}`);
};

// List notes with pagination, search & tags
export interface GetNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}

export interface GetNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const getNotes = async ({
  page,
  perPage,
  search,
  tag,
}: GetNotesParams): Promise<GetNotesResponse> => {
  const res = await serverGet<GetNotesResponse>("/notes", {
    params: { page, perPage, search, tag },
  });
  return res.data;
};