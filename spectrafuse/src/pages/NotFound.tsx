import React from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Home, Radar } from 'lucide-react';

export function NotFound() {
  return (
    <PageWrapper className="pt-24">
      <div className="max-w-2xl mx-auto px-4 text-center py-32">
        <div className="text-8xl font-extrabold gradient-text mb-6">404</div>
        <h1 className="text-2xl font-bold text-dark-text mb-4">Page Not Found</h1>
        <p className="text-dark-muted mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex gap-4 justify-center">
          <Link to="/">
            <Button variant="outline"><Home className="w-4 h-4" /> Go Home</Button>
          </Link>
          <Link to="/workbench">
            <Button><Radar className="w-4 h-4" /> Open Tool</Button>
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}
