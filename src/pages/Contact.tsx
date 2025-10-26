import { Mail, MessageSquare, Send } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Message sent!',
      description: 'Thank you for contacting us. We\'ll get back to you soon.',
    });
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center gap-3">
          <MessageSquare className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-4xl font-bold text-foreground">Contact Us</h1>
            <p className="text-muted-foreground mt-2">We'd love to hear from you</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what's on your mind..."
                  rows={6}
                  required
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </form>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Email</h3>
              </div>
              <p className="text-muted-foreground">support@fontlabs.com</p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-3">Office Hours</h3>
              <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
            </Card>

            <Card className="p-6 bg-gradient-primary">
              <h3 className="font-semibold text-white mb-3">Need Immediate Help?</h3>
              <p className="text-white/90 mb-4">Check out our FAQ section for quick answers to common questions.</p>
              <Button variant="secondary" className="w-full">
                View FAQ
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
