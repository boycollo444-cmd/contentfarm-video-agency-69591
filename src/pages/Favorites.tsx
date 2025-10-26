import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import FontCard from '@/components/fontlabs/FontCard';
import { Button } from '@/components/ui/button';
import { Heart, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { loadGoogleFont } from '@/lib/googleFonts';
import { useFavorites } from '@/hooks/useFavorites';

export default function Favorites() {
  const [fonts, setFonts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
      return;
    }
    setUser(user);
    fetchFavorites(user.id);
  };

  const { favorites, toggleFavorite } = useFavorites(user?.id);

  const fetchFavorites = async (userId: string) => {
    const { data: favData } = await supabase
      .from('favorites')
      .select('font_id')
      .eq('user_id', userId);

    if (favData && favData.length > 0) {
      const fontIds = favData.map(f => f.font_id);
      const { data: fontsData } = await supabase
        .from('fonts')
        .select('*')
        .in('id', fontIds);

      if (fontsData) {
        fontsData.forEach(font => {
          const fontFamily = (font as any).google_font_family || font.name;
          if (fontFamily) loadGoogleFont(fontFamily);
        });
        setFonts(fontsData);
      }
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center gap-3">
          <Heart className="h-8 w-8 text-primary fill-primary" />
          <div>
            <h1 className="text-4xl font-bold text-foreground">My Favorites</h1>
            <p className="text-muted-foreground mt-2">Fonts you've saved</p>
          </div>
        </div>

        {fonts.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-2xl font-bold text-foreground mb-4">No favorites yet</p>
            <p className="text-muted-foreground mb-6">
              Start browsing fonts and save your favorites
            </p>
            <Link to="/categories">
              <Button size="lg">Browse Fonts</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {fonts.map((font) => (
              <FontCard
                key={font.id}
                id={font.id}
                name={font.name}
                category={font.category}
                isPremium={font.is_premium}
                rating={font.rating}
                downloads={font.downloads}
                designer={font.designer}
                isNew={font.is_new}
                isFavorite={favorites.has(font.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
