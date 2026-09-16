'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import type { ChangeEvent } from 'react';

import { createNote } from '@/lib/api';
import { useNoteStore } from '@/lib/store/noteStore';
import type { NoteTag } from '@/types/note';

import css from './NoteForm.module.css';

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const draft = useNoteStore(state => state.draft);
  const setDraft = useNoteStore(state => state.setDraft);
  const clearDraft = useNoteStore(state => state.clearDraft);

  const mutation = useMutation({
    mutationFn: createNote,

    onSuccess: async () => {
      clearDraft();

      await queryClient.invalidateQueries({
        queryKey: ['notes'],
      });

      router.push('/notes/filter/all');
    },
  });

  const formAction = async (formData: FormData) => {
    const title = formData.get('title');
    const content = formData.get('content');
    const tag = formData.get('tag');

    if (
      typeof title !== 'string' ||
      typeof content !== 'string' ||
      typeof tag !== 'string'
    ) {
      return;
    }

    await mutation.mutateAsync({
      title: title.trim(),
      content: content.trim(),
      tag: tag as NoteTag,
    });
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDraft({
      title: event.target.value,
    });
  };

  const handleContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDraft({
      content: event.target.value,
    });
  };

  const handleTagChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setDraft({
      tag: event.target.value as NoteTag,
    });
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <form className={css.form} action={formAction}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>

        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          defaultValue={draft.title}
          onChange={handleTitleChange}
          minLength={3}
          maxLength={50}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>

        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          defaultValue={draft.content}
          onChange={handleContentChange}
          maxLength={500}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>

        <select
          id="tag"
          name="tag"
          className={css.select}
          defaultValue={draft.tag}
          onChange={handleTagChange}
          required
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Creating...' : 'Create note'}
        </button>
      </div>
    </form>
  );
}
