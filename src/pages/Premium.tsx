import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Crown, Check, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Premium() {
  const features = [
    'Unlimited access to premium fonts',
    'Commercial use license included',
    'AI-powered font tools',
    'Advanced font pairing suggestions',
    'Priority customer support',
    'Early access to new fonts',
    'Ad-free experience',
    'Bulk downloads',
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 bg-gradient-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Crown className="h-16 w-16 text-white mx-auto mb-6" />
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Go Premium
          </h1>
          <p className="text-white/90 text-lg mb-8">
            Unlock unlimited access to premium fonts and exclusive features
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 -mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Monthly Plan */}
            <Card className="p-8 hover:shadow-xl transition-shadow">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">Monthly</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-foreground">$12</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </div>
              <Button size="lg" className="w-full mb-6 bg-primary text-primary-foreground">
                Subscribe Monthly
              </Button>
              <ul className="space-y-3">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Annual Plan */}
            <Card className="p-8 border-2 border-primary relative hover:shadow-xl transition-shadow">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <div className="bg-gradient-premium px-4 py-1 rounded-full text-white text-sm font-semibold flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Save 20%
                </div>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">Annual</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-foreground">$115</span>
                  <span className="text-muted-foreground">/year</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Just $9.58/month</p>
              </div>
              <Button size="lg" className="w-full mb-6 bg-gradient-premium text-white hover:opacity-90">
                Subscribe Annually
              </Button>
              <ul className="space-y-3">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Go Premium?</h2>
            <p className="text-muted-foreground">Elevate your typography game with premium features</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                <Crown className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Premium Fonts</h3>
              <p className="text-muted-foreground">
                Access thousands of premium fonts with commercial licenses
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/10 rounded-2xl mb-4">
                <Sparkles className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">AI Tools</h3>
              <p className="text-muted-foreground">
                Smart font pairing, identification, and custom generation
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-2xl mb-4">
                <Check className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Priority Support</h3>
              <p className="text-muted-foreground">
                Get help fast with dedicated premium support
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}