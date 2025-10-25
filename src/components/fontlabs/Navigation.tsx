import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, Crown, User, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-xl border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              FONTLABS
            </div>
          </Link>
          
          {/* Desktop Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="text"
                placeholder="Search fonts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link 
              to="/categories" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/categories') ? 'text-primary' : 'text-foreground'
              }`}
            >
              Categories
            </Link>
            <Link 
              to="/trending" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/trending') ? 'text-primary' : 'text-foreground'
              }`}
            >
              Trending
            </Link>
            <Link 
              to="/collections" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/collections') ? 'text-primary' : 'text-foreground'
              }`}
            >
              Collections
            </Link>
            <Link 
              to="/ai-tools" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/ai-tools') ? 'text-primary' : 'text-foreground'
              }`}
            >
              AI Tools
            </Link>
            <Link 
              to="/community" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/community') ? 'text-primary' : 'text-foreground'
              }`}
            >
              Community
            </Link>
          </nav>
          
          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/favorites">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>
            <Link to="/premium">
              <Button className="bg-gradient-premium text-white shadow-premium hover:shadow-lg transition-all">
                <Crown className="h-4 w-4 mr-2" />
                Premium
              </Button>
            </Link>
            <Button variant="outline" size="icon" asChild>
              <Link to="/profile">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        
        {/* Mobile Search */}
        <div className="lg:hidden py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="text"
              placeholder="Search fonts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/categories" 
                className="text-sm font-medium py-2 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link 
                to="/trending" 
                className="text-sm font-medium py-2 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Trending
              </Link>
              <Link 
                to="/collections" 
                className="text-sm font-medium py-2 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Collections
              </Link>
              <Link 
                to="/ai-tools" 
                className="text-sm font-medium py-2 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                AI Tools
              </Link>
              <Link 
                to="/community" 
                className="text-sm font-medium py-2 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Community
              </Link>
              <div className="flex gap-3 pt-3">
                <Link to="/favorites" className="flex-1">
                  <Button variant="outline" className="w-full" onClick={() => setIsMenuOpen(false)}>
                    <Heart className="h-4 w-4 mr-2" />
                    Favorites
                  </Button>
                </Link>
                <Link to="/premium" className="flex-1">
                  <Button className="w-full bg-gradient-premium text-white" onClick={() => setIsMenuOpen(false)}>
                    <Crown className="h-4 w-4 mr-2" />
                    Premium
                  </Button>
                </Link>
              </div>
              <Link to="/profile" className="pt-2">
                <Button variant="outline" className="w-full" onClick={() => setIsMenuOpen(false)}>
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
