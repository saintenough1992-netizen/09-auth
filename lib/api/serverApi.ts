import { cookies } from 'next/headers';
import api from './api';
import type { Note, NoteTag } from '@/types/note';
import type { User } from '@/types/user';

interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: NoteTag;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const getCookieHeader = async () => {
  const cookieStore = await cookies();
  return cookieStore.toString();
};

export const fetchNotes = async (
  params: FetchNotesParams
): Promise<FetchNotesResponse> => {
  const cookie = await getCookieHeader();
  const { data } = await api.get<FetchNotesResponse>('/notes', {
    params,
    headers: { Cookie: cookie },
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookie = await getCookieHeader();
  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: { Cookie: cookie },
  });
  return data;
};

export const getMe = async (): Promise<User> => {
  const cookie = await getCookieHeader();
  const { data } = await api.get<User>('/users/me', {
    headers: { Cookie: cookie },
  });
  return data;
};

export const checkSession = async () => {
  const cookieStore = await cookies();

  const response = await api.get('/auth/session', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response;
};
