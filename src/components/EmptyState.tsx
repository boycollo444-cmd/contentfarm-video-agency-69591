import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  actionLink: string;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, actionLink }: EmptyStateProps) {
  return (
    <div className="text-center py-20">
      <Icon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
      <p className="text-2xl font-bold text-foreground mb-4">{title}</p>
      <p className="text-muted-foreground mb-6">{description}</p>
      <Link to={actionLink}>
        <Button size="lg" className="bg-primary text-primary-foreground">
          {actionLabel}
        </Button>
      </Link>
    </div>
  );
}
