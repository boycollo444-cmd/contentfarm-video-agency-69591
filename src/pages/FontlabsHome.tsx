import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Crown, Users, Wand2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import FontCard from '@/components/fontlabs/FontCard';
import { supabase } from '@/integrations/supabase/client';
import { loadGoogleFont } from '@/lib/googleFonts';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

const ITEMS_PER_PAGE = 16;

export default function FontlabsHome() {
  const [trendingFonts, setTrendingFonts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  useEffect(() => {
    fetchTrendingFonts(true);
  }, []);

  const fetchTrendingFonts = async (reset = false) => {
    setLoading(true);
    const currentPage = reset ? 1 : page;
    const from = (currentPage - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    const { data, error } = await supabase
      .from('fonts')
      .select('*')
      .order('downloads', { ascending: false })
      .range(from, to);
    
    if (!error && data) {
      // Load Google Fonts dynamically
      data.forEach(font => {
        const fontFamily = (font as any).google_font_family || font.name;
        if (fontFamily) {
          loadGoogleFont(fontFamily);
        }
      });

      if (reset) {
        setTrendingFonts(data);
        setPage(2);
      } else {
        setTrendingFonts(prev => [...prev, ...data]);
        setPage(prev => prev + 1);
      }
      setHasMore(data.length === ITEMS_PER_PAGE);
    }
    setLoading(false);
  };

  const lastFontRef = useInfiniteScroll({
    loading,
    hasMore,
    onLoadMore: () => fetchTrendingFonts(false)
  });

  const categories = [
    { name: 'Serif', icon: '𝐒', count: 245 },
    { name: 'Sans-Serif', icon: 'S', count: 389 },
    { name: 'Script', icon: '𝒮', count: 156 },
    { name: 'Display', icon: '𝕊', count: 298 },
    { name: 'Monospace', icon: 'S', count: 124 },
    { name: 'Handwritten', icon: '𝓢', count: 187 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-subtle" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm font-medium text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              Your Typography Playground
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
              Discover the Perfect Font
              <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                For Every Project
              </span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Explore thousands of free and premium fonts from Google Fonts. Test, compare, and download 
              high-quality typefaces for your creative projects.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/categories">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg">
                  Browse Fonts
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/premium">
                <Button size="lg" variant="outline" className="border-2">
                  <Crown className="mr-2 h-5 w-5 text-warning" />
                  Go Premium
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Interactive Font Showcase */}
          <div className="mt-16 bg-card rounded-2xl shadow-xl p-8 border border-border">
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground uppercase tracking-wider">Try it yourself</p>
              <input 
                type="text"
                placeholder="Type to preview fonts..."
                className="w-full text-center text-3xl lg:text-5xl font-bold bg-transparent border-none outline-none text-foreground"
                defaultValue="Beautiful Typography"
              />
              <div className="flex flex-wrap justify-center gap-2">
                <Button size="sm" variant="secondary">Aa</Button>
                <Button size="sm" variant="outline">Size</Button>
                <Button size="sm" variant="outline">Weight</Button>
                <Button size="sm" variant="outline">Color</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Trending Fonts Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground">All Fonts</h2>
              <p className="text-muted-foreground mt-2">Browse our complete collection</p>
            </div>
            <Link to="/trending">
              <Button variant="ghost">
                View Trending
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingFonts.map((font, index) => {
              const isLastItem = index === trendingFonts.length - 1;
              return (
                <div key={font.id} ref={isLastItem ? lastFontRef : null}>
                  <FontCard
                    id={font.id}
                    name={font.name}
                    category={font.category}
                    rating={font.rating}
                    downloads={font.downloads}
                    designer={font.designer}
                    isPremium={font.is_premium}
                    isNew={font.is_new}
                  />
                </div>
              );
            })}
          </div>

          {loading && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {!hasMore && trendingFonts.length > 0 && (
            <div className="text-center py-8 text-muted-foreground">
              All fonts loaded ({trendingFonts.length} total)
            </div>
          )}

          {!loading && trendingFonts.length === 0 && (
            <div className="text-center py-20 bg-card rounded-lg">
              <p className="text-2xl font-bold text-foreground mb-4">No Fonts Available</p>
              <p className="text-muted-foreground mb-6">
                The database is empty. Please populate it with fonts from Google Fonts API.
              </p>
              <Link to="/populate">
                <Button size="lg" className="bg-primary text-primary-foreground">
                  Populate Database
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Browse by Category</h2>
            <p className="text-muted-foreground mt-2">Find the perfect style for your project</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link key={category.name} to={`/categories/${category.name.toLowerCase()}`}>
                <div className="group bg-card hover:bg-accent/10 rounded-xl p-6 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md cursor-pointer">
                  <div className="text-center space-y-3">
                    <div className="text-5xl mb-2 group-hover:scale-110 transition-transform">
                      {category.icon}
                    </div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{category.count} fonts</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features / Why Choose Us */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Why Choose FONTLABS?</h2>
            <p className="text-muted-foreground mt-2">Everything you need for typography excellence</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                <Crown className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Premium Quality</h3>
              <p className="text-muted-foreground">
                Access to Google Fonts library with thousands of high-quality fonts
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/10 rounded-2xl mb-4">
                <Wand2 className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">AI-Powered Tools</h3>
              <p className="text-muted-foreground">
                Smart font pairing, identification, and custom generator tools
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-2xl mb-4">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Active Community</h3>
              <p className="text-muted-foreground">
                Share collections, rate fonts, and connect with fellow designers
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Elevate Your Typography?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Join thousands of designers and unlock premium fonts, AI tools, and exclusive features
          </p>
          <Link to="/premium">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 shadow-xl">
              <Crown className="mr-2 h-5 w-5" />
              Subscribe to Premium
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
                FONTLABS
              </div>
              <p className="text-sm text-muted-foreground">
                Your ultimate typography playground for discovering and downloading beautiful fonts.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Explore</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/categories" className="hover:text-primary transition-colors">Categories</Link></li>
                <li><Link to="/trending" className="hover:text-primary transition-colors">Trending</Link></li>
                <li><Link to="/collections" className="hover:text-primary transition-colors">Collections</Link></li>
                <li><Link to="/community" className="hover:text-primary transition-colors">Community</Link></li>
                <li><Link to="/favorites" className="hover:text-primary transition-colors">Favorites</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/ai-tools" className="hover:text-primary transition-colors">AI Tools</Link></li>
                <li><Link to="/premium" className="hover:text-primary transition-colors">Premium</Link></li>
                <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Admin</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/populate" className="hover:text-primary transition-colors">Populate Database</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2025 FONTLABS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
