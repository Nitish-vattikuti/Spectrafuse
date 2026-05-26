import React, { useEffect } from 'react';

export function PageWrapper({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className={`page-enter min-h-screen ${className}`}>
      {children}
    </main>
  );
}
