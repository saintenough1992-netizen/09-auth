import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Roboto } from 'next/font/google';

import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';

import 'modern-normalize/modern-normalize.css';
import './globals.css';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NoteHub',
  description:
    'NoteHub is a simple and efficient application for managing personal notes.',

  openGraph: {
    title: 'NoteHub',
    description:
      'NoteHub is a simple and efficient application for managing personal notes.',
    url: 'https://notehub.com/',
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

interface RootLayoutProps {
  children: ReactNode;
  modal: ReactNode;
}

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${roboto.className} ${roboto.variable}`}>
        <TanStackProvider>
          <Header />

          {children}

          {modal}

          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}
