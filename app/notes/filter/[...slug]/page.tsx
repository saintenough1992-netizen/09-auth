import type { Metadata } from 'next';

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { fetchNotes } from '@/lib/api';
import type { NoteTag } from '@/types/note';

import NotesClient from './Notes.client';

const PER_PAGE = 12;

const allowedTags: NoteTag[] = [
  'Todo',
  'Work',
  'Personal',
  'Meeting',
  'Shopping',
];

interface NotesPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateMetadata({
  params,
}: NotesPageProps): Promise<Metadata> {
  const { slug } = await params;

  const filter = slug[0] ?? 'all';

  const title =
    filter === 'all' ? 'All notes | NoteHub' : `${filter} notes | NoteHub`;

  const description =
    filter === 'all'
      ? 'Browse all notes in NoteHub.'
      : `Browse notes with the ${filter} tag in NoteHub.`;

  return {
    title,
    description,

    openGraph: {
      title,
      description,
      url: `https://notehub.com/notes/filter/${filter}`,

      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 800,
          alt: 'NoteHub',
        },
      ],
    },
  };
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { slug } = await params;

  const filterValue = slug[0];

  const tag: NoteTag | undefined = allowedTags.includes(filterValue as NoteTag)
    ? (filterValue as NoteTag)
    : undefined;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag ?? 'all'],

    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: PER_PAGE,
        search: '',
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
