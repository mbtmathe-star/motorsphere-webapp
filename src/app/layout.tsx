// src/app/layout.tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AuthProvider } from '@/components/providers/AuthProvider';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'MotorSphere — South Africa\'s Automotive Marketplace',
    template: '%s | MotorSphere',
  },
  description: 'Buy and sell vehicles, parts, and accessories across South Africa.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  openGraph: {
    siteName: 'MotorSphere',
    locale: 'en_ZA',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // 'dark' class forces shadcn/ui dark mode — MotorSphere is dark-first
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="min-h-screen flex flex-col antialiased">
        {/*
          AuthProvider wraps everything so every client component can call useAuth().
          It is a "use client" component — safe to use inside this Server Component layout
          because Next.js renders client components at the boundary.
        */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
