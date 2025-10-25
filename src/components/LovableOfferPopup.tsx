import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import lovableLogo from '@/assets/lovable-logo.png';

interface LovableOfferPopupProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const LovableOfferPopup = ({ isOpen: externalIsOpen, onOpenChange }: LovableOfferPopupProps = {}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3 * 24 * 60 * 60); // 3 days in seconds
  
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    } else {
      setInternalIsOpen(open);
    }
  };

  useEffect(() => {
    // Show popup after 5 seconds, only once per session
    if (!hasShown) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasShown(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [hasShown]);

  useEffect(() => {
    // Countdown timer
    if (isOpen && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen, timeLeft]);

  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const mins = Math.floor((seconds % (60 * 60)) / 60);
    const secs = seconds % 60;
    
    return `${days}d ${hours}h ${mins}m ${secs}s`;
  };

  const handleInstagramClick = () => {
    window.open('https://instagram.com/contentfarm.club', '_blank');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-2 border-primary/20">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-3 top-3 z-50 w-8 h-8 rounded-full border-2 border-orange-500 bg-background/80 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:bg-orange-500/10 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          <X className="h-4 w-4 text-foreground" />
          <span className="sr-only">Close</span>
        </button>

        <div className="bg-gradient-to-br from-orange-500/10 via-background to-pink-500/10 p-6">
          {/* Lovable Logo */}
          <div className="flex justify-center mb-4">
            <img src={lovableLogo} alt="Lovable" className="h-12 w-12" />
          </div>

          {/* Countdown Timer */}
          <div className="mb-4 text-center">
            <div className="inline-block bg-destructive/90 text-destructive-foreground px-4 py-1.5 rounded-full text-xs font-bold animate-pulse">
              🔥 Expires in {formatTime(timeLeft)}
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-4">
            <div className="inline-block bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold mb-3">
              💥 EXCLUSIVE OFFER
            </div>
            <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Special for Lovable Users
            </h2>
            <p className="text-sm text-muted-foreground font-medium">
              Limited Time Only!
            </p>
          </div>

          {/* Main Offer Box */}
          <div className="bg-card border-2 border-primary/20 rounded-lg p-4 mb-4 shadow-lg">
            <div className="text-center mb-3">
              <div className="text-xl font-bold text-primary mb-2">
                3 Social Media Videos
              </div>
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-lg text-muted-foreground line-through">$250</span>
                <span className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                  $100
                </span>
              </div>
              <p className="text-xs text-muted-foreground italic">For Lovable Users Only</p>
            </div>

            <p className="text-center text-sm text-foreground/80 mb-3">
              Perfect for founders who need scroll-stopping content fast.
            </p>

            <div className="bg-primary/5 rounded-lg p-3">
              <p className="text-center text-sm font-semibold text-foreground">
                🔥 Full production: editing, captions, pacing & hooks
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mb-3">
            <Button 
              onClick={handleInstagramClick}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
            >
              👉 DM "LOVABLE" on Instagram
            </Button>
          </div>

          {/* Fine Print */}
          <p className="text-center text-xs text-muted-foreground">
            Get agency-grade video content for startup prices.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LovableOfferPopup;
