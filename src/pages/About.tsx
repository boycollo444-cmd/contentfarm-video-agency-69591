import { Info } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center gap-3">
          <Info className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold text-foreground">About FONTLABS</h1>
        </div>

        <Card className="p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              FONTLABS is your ultimate typography playground. We provide designers, developers, and creatives 
              with access to thousands of high-quality fonts from Google Fonts, all in one beautifully designed 
              platform.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">What We Offer</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Access to 1000+ premium quality fonts from Google Fonts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Live font preview and testing tools</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Favorites and collections management</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>AI-powered font pairing and identification (coming soon)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Community features for designers</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Get Started</h2>
            <p className="text-muted-foreground leading-relaxed">
              Browse our collection, save your favorites, and download fonts for your next creative project. 
              Sign up for a free account to unlock all features.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
