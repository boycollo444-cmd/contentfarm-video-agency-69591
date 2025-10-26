import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useFavorites(userId: string | undefined) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchFavorites();
    }
  }, [userId]);

  const fetchFavorites = async () => {
    if (!userId) return;
    
    const { data } = await supabase
      .from('favorites')
      .select('font_id')
      .eq('user_id', userId);
    
    if (data) {
      setFavorites(new Set(data.map(f => f.font_id)));
    }
  };

  const toggleFavorite = async (fontId: string) => {
    if (!userId) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to save favorites',
        variant: 'destructive',
      });
      return;
    }

    const isFavorite = favorites.has(fontId);

    if (isFavorite) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('font_id', fontId);

      if (!error) {
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(fontId);
          return newSet;
        });
        toast({ title: 'Removed from favorites' });
      }
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: userId, font_id: fontId });

      if (!error) {
        setFavorites(prev => new Set(prev).add(fontId));
        toast({ title: 'Added to favorites' });
      }
    }
  };

  return { favorites, toggleFavorite };
}
