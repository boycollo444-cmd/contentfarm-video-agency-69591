import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Folder, Lock, Globe, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Collections() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    const { data, error } = await supabase
      .from('collections')
      .select(`
        *,
        profiles (username, avatar_url),
        collection_fonts (count)
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setCollections(data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Font Collections</h1>
          <p className="text-muted-foreground">Curated font collections from our community</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : collections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <Card key={collection.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <Folder className="h-8 w-8 text-primary" />
                  {collection.is_public ? (
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{collection.name}</h3>
                {collection.description && (
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{collection.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {collection.collection_fonts?.length || 0} fonts
                  </span>
                  <Button variant="ghost" size="sm">View Collection</Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg mb-4">No public collections yet</p>
            <Link to="/">
              <Button>Browse Fonts</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}