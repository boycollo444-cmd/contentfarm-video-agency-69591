import { Crown, Heart, Download, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FontCardProps {
  id: string;
  name: string;
  category: string;
  isPremium?: boolean;
  rating?: number;
  downloads?: number;
  previewText?: string;
  designer?: string;
  isNew?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (fontId: string) => void;
}

export default function FontCard({
  id,
  name,
  category,
  isPremium = false,
  rating = 0,
  downloads = 0,
  previewText = 'The quick brown fox',
  designer,
  isNew = false,
  isFavorite = false,
  onToggleFavorite,
}: FontCardProps) {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to save favorites',
        variant: 'destructive',
      });
      return;
    }

    if (onToggleFavorite) {
      onToggleFavorite(id);
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Increment download count
    await supabase
      .from('fonts')
      .update({ downloads: downloads + 1 })
      .eq('id', id);
    
    toast({
      title: 'Download Started',
      description: `${name} is being downloaded`,
    });
  };
  return (
    <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 border border-border bg-card">
      <Link to={`/font/${id}`} className="block p-6">
        {/* Premium Badge */}
        {isPremium && (
          <Badge className="absolute top-3 right-3 bg-gradient-premium text-white shadow-premium">
            <Crown className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        )}
        
        {/* New Badge */}
        {isNew && !isPremium && (
          <Badge className="absolute top-3 right-3 bg-secondary text-secondary-foreground">
            New
          </Badge>
        )}
        
        {/* Font Preview */}
        <div className="mb-4 min-h-[80px] flex items-center justify-center">
          <p 
            className="text-3xl text-center text-foreground transition-transform group-hover:scale-105"
            style={{ fontFamily: `'${name}', sans-serif` }}
          >
            {previewText}
          </p>
        </div>
        
        {/* Font Info */}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {name}
              </h3>
              {designer && (
                <p className="text-sm text-muted-foreground">by {designer}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <Badge variant="secondary">{category}</Badge>
            
            <div className="flex items-center gap-3 text-muted-foreground">
              {rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-warning text-warning" />
                  <span>{rating.toFixed(1)}</span>
                </div>
              )}
              {downloads > 0 && (
                <div className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  <span>{downloads > 1000 ? `${(downloads / 1000).toFixed(1)}k` : downloads}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
      
      {/* Action Buttons - Show on Hover */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1" onClick={handleSave}>
            <Heart className={`h-4 w-4 mr-1 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            Save
          </Button>
          <Button size="sm" className="flex-1 bg-primary text-primary-foreground" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" />
            {isPremium ? 'Premium' : 'Download'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
