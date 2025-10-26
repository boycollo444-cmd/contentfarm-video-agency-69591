import { Users } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';

export default function Community() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-4xl font-bold text-foreground">Community</h1>
            <p className="text-muted-foreground mt-2">Connect with fellow designers</p>
          </div>
        </div>

        <EmptyState
          icon={Users}
          title="Community Coming Soon"
          description="Connect with designers, share collections, and discover new fonts together"
          actionLabel="Browse Fonts"
          actionLink="/categories"
        />
      </div>
    </div>
  );
}
