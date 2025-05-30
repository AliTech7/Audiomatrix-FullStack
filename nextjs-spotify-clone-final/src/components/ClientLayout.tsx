'use client';

import { SessionProvider } from 'next-auth/react';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <header className="bg-black text-yellow-400 p-4 rounded-md border-2 border-b-yellow-400 border-r-black border-l-black border-t-black">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold pl-7">Audiomatrix</h1>
          <img
            src="/logo.png"
            alt="Audiomatrix Logo"
            className="h-12 w-auto pr-5"
          />
        </div>
      </header>
      <main className="h-full">
        {children}
      </main>
    </SessionProvider>
  );
} 
