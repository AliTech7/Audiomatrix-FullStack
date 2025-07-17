'use client';

import { SessionProvider } from 'next-auth/react';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="flex flex-col w-full">
        <header className="bg-black text-yellow-400 p-4 border-b-2 border-yellow-400">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
            <h1 className="text-2xl font-bold pl-2 sm:pl-7 text-center sm:text-left">
              Audiomatrix
            </h1>
            <img
              src="/logo.png"
              alt="Audiomatrix Logo"
              className="h-12 w-auto pr-2 sm:pr-5"
            />
          </div>
        </header>

        <main className="flex-1 w-full">
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}
