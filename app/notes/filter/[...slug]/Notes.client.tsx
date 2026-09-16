'use client';

import Link from 'next/link';
import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';

import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';

import { fetchNotes } from '@/lib/api';
import type { NoteTag } from '@/types/note';

import css from './NotesPage.module.css';

const PER_PAGE = 12;

interface NotesClientProps {
  tag?: NoteTag;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, search, tag ?? 'all'],

    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search,
        tag,
      }),

    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    debouncedSearch(value);
  };

  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }

  if (isError) {
    return <p>Something went wrong.</p>;
  }

  return (
    <main className={css.main}>
      <div className={css.container}>
        <header className={css.toolbar}>
          <SearchBox value={searchInput} onChange={handleSearchChange} />

          {data && data.totalPages > 1 && (
            <Pagination
              pageCount={data.totalPages}
              currentPage={page}
              onPageChange={setPage}
            />
          )}

          <Link href="/notes/action/create" className={css.button}>
            Create note +
          </Link>
        </header>

        {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
      </div>
    </main>
  );
}
