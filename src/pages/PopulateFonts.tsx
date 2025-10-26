import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { fetchGoogleFonts, categorizeFont } from '@/lib/googleFonts';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function PopulateFonts() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const { toast } = useToast();

  const populateFonts = async () => {
    setLoading(true);
    setProgress('Fetching fonts from Google Fonts API...');
    
    try {
      const fonts = await fetchGoogleFonts('popularity');
      setProgress(`Fetched ${fonts.length} fonts. Inserting into database...`);
      
      // Take first 500 fonts for better performance
      const fontsToInsert = fonts.slice(0, 500).map((font, index) => ({
        name: font.family,
        slug: font.family.toLowerCase().replace(/\s+/g, '-'),
        category: categorizeFont(font.category) as any,
        designer: 'Google Fonts',
        rating: 4.0 + Math.random(),
        downloads: Math.floor(Math.random() * 50000) + 1000,
        is_premium: index % 10 === 0, // Every 10th font is premium
        is_new: index < 20, // First 20 are new
        favorites_count: Math.floor(Math.random() * 1000),
        description: `${font.family} is a beautiful ${font.category} font from Google Fonts, featuring ${font.variants.length} variants and supporting ${font.subsets.join(', ')} character sets.`,
        google_font_family: font.family,
      }));

      // Insert in batches of 100
      for (let i = 0; i < fontsToInsert.length; i += 100) {
        const batch = fontsToInsert.slice(i, i + 100);
        const { error } = await supabase
          .from('fonts')
          .insert(batch);
        
        if (error) throw error;
        setProgress(`Inserted ${Math.min(i + 100, fontsToInsert.length)} of ${fontsToInsert.length} fonts...`);
      }

      toast({
        title: 'Success!',
        description: `Successfully populated ${fontsToInsert.length} fonts from Google Fonts`,
      });
      
      setProgress(`✓ Complete! ${fontsToInsert.length} fonts added.`);
    } catch (error) {
      console.error('Error populating fonts:', error);
      toast({
        title: 'Error',
        description: 'Failed to populate fonts. Please try again.',
        variant: 'destructive',
      });
      setProgress('Error occurred. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-foreground mb-4">Populate Database</h1>
        <p className="text-muted-foreground mb-6">
          Click the button below to fetch fonts from Google Fonts API and populate the database.
        </p>
        
        <Button 
          onClick={populateFonts} 
          disabled={loading}
          className="w-full mb-4"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Populating...
            </>
          ) : (
            'Populate Fonts'
          )}
        </Button>
        
        {progress && (
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">{progress}</p>
          </div>
        )}
      </Card>
    </div>
  );
}
