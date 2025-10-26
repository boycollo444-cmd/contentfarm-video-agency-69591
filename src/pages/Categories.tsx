import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import FontCard from '@/components/fontlabs/FontCard';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { loadGoogleFont } from '@/lib/googleFonts';

export default function Categories() {
  const { category } = useParams();
  const [fonts, setFonts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');

  const categories = [
    { id: 'all', name: 'All Fonts' },
    { id: 'serif', name: 'Serif' },
    { id: 'sans-serif', name: 'Sans-Serif' },
    { id: 'script', name: 'Script' },
    { id: 'display', name: 'Display' },
    { id: 'monospace', name: 'Monospace' },
    { id: 'handwritten', name: 'Handwritten' },
    { id: 'modern', name: 'Modern' },
    { id: 'vintage', name: 'Vintage' },
    { id: 'rounded', name: 'Rounded' },
    { id: 'gothic', name: 'Gothic' },
  ];

  useEffect(() => {
    fetchFonts();
  }, [selectedCategory]);

  const fetchFonts = async () => {
    setLoading(true);
    let query = supabase.from('fonts').select('*');
    
    if (selectedCategory !== 'all') {
      query = query.eq('category', selectedCategory as any);
    }
    
    const { data, error } = await query
      .order('downloads', { ascending: false })
      .limit(1000); // Load up to 1000 fonts
    
    if (!error && data) {
      // Load Google Fonts dynamically
      data.forEach(font => {
        const fontFamily = (font as any).google_font_family || font.name;
        if (fontFamily) {
          loadGoogleFont(fontFamily);
        }
      });
      setFonts(data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Browse Fonts</h1>
          <p className="text-muted-foreground">Explore our collection of beautiful typography</p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(cat.id)}
              className="rounded-full"
            >
              {cat.name}
            </Button>
          ))}
        </div>

        {/* Fonts Grid */}
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

        {!loading && fonts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No fonts found in this category</p>
            <Link to="/">
              <Button className="mt-4">Browse All Fonts</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}