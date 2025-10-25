import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Heart, Folder, Settings, Crown, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      fetchProfile(user.id);
      fetchFavorites(user.id);
      fetchCollections(user.id);
    } else {
      setLoading(false);
    }
  };

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (data) {
      setProfile(data);
    }
    setLoading(false);
  };

  const fetchFavorites = async (userId: string) => {
    const { data } = await supabase
      .from('favorites')
      .select('*, fonts(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (data) {
      setFavorites(data);
    }
  };

  const fetchCollections = async (userId: string) => {
    const { data } = await supabase
      .from('collections')
      .select('*, collection_fonts(count)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (data) {
      setCollections(data);
    }
  };

  const updateProfile = async (updates: any) => {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
      fetchProfile(user.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Sign in Required</h2>
          <p className="text-muted-foreground mb-6">
            Please sign in to access your profile
          </p>
          <Link to="/auth">
            <Button>Sign In</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <Card className="p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center">
                <User className="h-12 w-12 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-1">
                  {profile?.full_name || 'User'}
                </h1>
                <p className="text-muted-foreground">@{profile?.username || 'username'}</p>
                {profile?.is_premium && (
                  <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-gradient-premium rounded-full text-white text-sm">
                    <Crown className="h-3 w-3" />
                    Premium Member
                  </div>
                )}
              </div>
            </div>
            {!profile?.is_premium && (
              <Link to="/premium">
                <Button className="bg-gradient-premium text-white">
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade to Premium
                </Button>
              </Link>
            )}
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="favorites" className="space-y-6">
          <TabsList>
            <TabsTrigger value="favorites" className="gap-2">
              <Heart className="h-4 w-4" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="collections" className="gap-2">
              <Folder className="h-4 w-4" />
              Collections
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="favorites">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Your Favorite Fonts</h2>
              {favorites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {favorites.map((fav) => (
                    <Link key={fav.id} to={`/font/${fav.font_id}`}>
                      <Card className="p-4 hover:shadow-md transition-shadow">
                        <p className="text-lg font-semibold text-foreground">{fav.fonts?.name}</p>
                        <p className="text-sm text-muted-foreground">{fav.fonts?.category}</p>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No favorites yet</p>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="collections">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">Your Collections</h2>
                <Button>Create Collection</Button>
              </div>
              {collections.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {collections.map((col) => (
                    <Card key={col.id} className="p-4">
                      <Folder className="h-8 w-8 text-primary mb-2" />
                      <p className="font-semibold text-foreground">{col.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {col.collection_fonts?.length || 0} fonts
                      </p>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No collections yet</p>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Profile Settings</h2>
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                updateProfile({
                  full_name: formData.get('full_name'),
                  username: formData.get('username'),
                  bio: formData.get('bio'),
                });
              }}>
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    defaultValue={profile?.full_name || ''}
                  />
                </div>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    defaultValue={profile?.username || ''}
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    defaultValue={profile?.bio || ''}
                    rows={4}
                  />
                </div>
                <Button type="submit">Save Changes</Button>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}