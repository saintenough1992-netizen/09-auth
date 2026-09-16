'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { login } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import css from './SignIn.module.css';

export default function SignIn() {
  const router = useRouter();
  const setUser = useAuthStore(state => state.setUser);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError('');
    const formData = new FormData(event.currentTarget);
    try {
      const user = await login({ email: String(formData.get('email')), password: String(formData.get('password')) });
      setUser(user); router.push('/profile'); router.refresh();
    } catch (err) {
      setError(axios.isAxiosError(err) ? (err.response?.data?.message ?? 'Login failed') : 'Login failed');
    }
  };

  return <main className={css.mainContent}><h1 className={css.formTitle}>Sign in</h1><form className={css.form} onSubmit={handleSubmit}>
    <div className={css.formGroup}><label htmlFor="email">Email</label><input id="email" type="email" name="email" className={css.input} required /></div>
    <div className={css.formGroup}><label htmlFor="password">Password</label><input id="password" type="password" name="password" className={css.input} required /></div>
    <div className={css.actions}><button type="submit" className={css.submitButton}>Log in</button></div>
    {error && <p className={css.error}>{error}</p>}
  </form></main>;
}
