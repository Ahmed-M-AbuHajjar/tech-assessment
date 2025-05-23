import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { Navbar } from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Project Management System',
  description: 'A modern project management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider>
            <Navbar />
            <main>{children}</main>
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
