import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import FontCard from '@/components/fontlabs/FontCard';
import { Loader2, TrendingUp } from 'lucide-react';

export default function Trending() {
  const [fonts, setFonts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingFonts();
  }, []);

  const fetchTrendingFonts = async () => {
    const { data, error } = await supabase
      .from('fonts')
      .select('*')
      .order('downloads', { ascending: false })
      .limit(50);
    
    if (!error && data) {
      setFonts(data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-4xl font-bold text-foreground">Trending Fonts</h1>
            <p className="text-muted-foreground mt-2">Most popular fonts this week</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}