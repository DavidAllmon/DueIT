'use client';

import React from 'react';
import { ClientAuthProvider } from '../components/ClientAuthProvider';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientAuthProvider>
      <div className="bg-gray-900 text-white min-h-screen">
        {children}
      </div>
    </ClientAuthProvider>
  );
}