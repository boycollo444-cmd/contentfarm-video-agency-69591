import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wand2, Image, Palette, Sparkles } from 'lucide-react';

export default function AITools() {
  const tools = [
    {
      icon: Palette,
      title: 'Font Pairing',
      description: 'Get AI-powered suggestions for complementary font combinations',
      status: 'Available',
    },
    {
      icon: Image,
      title: 'Font Identification',
      description: 'Upload an image and let AI identify the fonts used',
      status: 'Available',
    },
    {
      icon: Wand2,
      title: 'Custom Font Generator',
      description: 'Turn your handwriting or sketches into downloadable fonts',
      status: 'Coming Soon',
    },
    {
      icon: Sparkles,
      title: 'Smart Recommendations',
      description: 'Personalized font suggestions based on your preferences',
      status: 'Available',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-4">
            <Sparkles className="h-4 w-4" />
            AI-Powered Typography Tools
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">AI Tools</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Leverage artificial intelligence to enhance your typography workflow
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {tools.map((tool, i) => (
            <Card key={i} className="p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-primary rounded-2xl flex-shrink-0">
                  <tool.icon className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-foreground">{tool.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      tool.status === 'Available' 
                        ? 'bg-success/10 text-success' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {tool.status}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-4">{tool.description}</p>
                  <Button 
                    variant={tool.status === 'Available' ? 'default' : 'outline'}
                    disabled={tool.status !== 'Available'}
                  >
                    {tool.status === 'Available' ? 'Try Now' : 'Coming Soon'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <Card className="p-12 bg-gradient-subtle text-center">
          <Wand2 className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Unlock All AI Tools with Premium
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Get unlimited access to all AI-powered features and elevate your typography game
          </p>
          <Button size="lg" className="bg-gradient-premium text-white">
            Upgrade to Premium
          </Button>
        </Card>
      </div>
    </div>
  );
}