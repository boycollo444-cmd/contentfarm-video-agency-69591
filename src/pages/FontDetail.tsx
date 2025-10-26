import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Crown, Download, Heart, Star, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { loadGoogleFont } from '@/lib/googleFonts';

export default function FontDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const [font, setFont] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [previewText, setPreviewText] = useState('The quick brown fox jumps over the lazy dog');
  const [fontSize, setFontSize] = useState([48]);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      fetchFont();
    }
  }, [id]);

  const fetchFont = async () => {
    const { data, error } = await supabase
      .from('fonts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (!error && data) {
      setFont(data);
      // Load the Google Font dynamically
      const fontFamily = (data as any).google_font_family || data.name;
      if (fontFamily) {
        loadGoogleFont(fontFamily);
      }
    }
    setLoading(false);
  };

  const handleDownload = async () => {
    if (!font) return;
    
    // Increment download count
    await supabase
      .from('fonts')
      .update({ downloads: font.downloads + 1 })
      .eq('id', font.id);
    
    toast({
      title: 'Download Started',
      description: `${font.name} is being downloaded`,
    });
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? 'Removed from favorites' : 'Added to favorites',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!font) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Font not found</p>
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Fonts
          </Button>
        </Link>

        {/* Font Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">{font.name}</h1>
            <p className="text-muted-foreground">by {font.designer}</p>
            <div className="flex gap-2 mt-3">
              <Badge>{font.category}</Badge>
              {font.is_premium && (
                <Badge className="bg-gradient-premium text-white">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
              {font.is_new && <Badge variant="secondary">New</Badge>}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="lg" onClick={toggleFavorite}>
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button size="lg" onClick={handleDownload} className="bg-primary text-primary-foreground">
              <Download className="mr-2 h-5 w-5" />
              Download
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Star className="h-4 w-4 fill-warning text-warning" />
              <span className="text-sm">Rating</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{font.rating.toFixed(1)}</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Download className="h-4 w-4" />
              <span className="text-sm">Downloads</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {font.downloads > 1000 ? `${(font.downloads / 1000).toFixed(1)}k` : font.downloads}
            </p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Heart className="h-4 w-4" />
              <span className="text-sm">Favorites</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{font.favorites_count}</p>
          </Card>
        </div>

        {/* Live Preview */}
        <Card className="p-8 mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Live Preview</h2>
          <Input
            value={previewText}
            onChange={(e) => setPreviewText(e.target.value)}
            className="mb-6 text-lg"
            placeholder="Type to preview..."
          />
          <div className="mb-6">
            <label className="text-sm text-muted-foreground mb-2 block">Font Size: {fontSize[0]}px</label>
            <Slider
              value={fontSize}
              onValueChange={setFontSize}
              min={16}
              max={120}
              step={1}
              className="mb-4"
            />
          </div>
          <div
            className="bg-muted/30 rounded-lg p-8 min-h-[200px] flex items-center justify-center text-center break-words"
            style={{ 
              fontSize: `${fontSize[0]}px`, 
              fontFamily: `'${(font as any).google_font_family || font.name}', sans-serif` 
            }}
          >
            {previewText}
          </div>
        </Card>

        {/* Description */}
        {font.description && (
          <Card className="p-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">About This Font</h2>
            <p className="text-muted-foreground leading-relaxed">{font.description}</p>
          </Card>
        )}
      </div>
    </div>
  );
}