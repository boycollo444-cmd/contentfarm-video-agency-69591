-- Create enum types
CREATE TYPE font_category AS ENUM ('serif', 'sans-serif', 'script', 'display', 'monospace', 'handwritten', 'modern', 'vintage', 'rounded', 'gothic');
CREATE TYPE font_license AS ENUM ('free', 'premium', 'commercial', 'personal');

-- Create fonts table
CREATE TABLE public.fonts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category font_category NOT NULL,
  designer TEXT,
  description TEXT,
  preview_text TEXT DEFAULT 'The quick brown fox',
  license font_license NOT NULL DEFAULT 'free',
  is_premium BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  favorites_count INTEGER DEFAULT 0,
  file_url TEXT,
  preview_image_url TEXT,
  font_weights TEXT[] DEFAULT ARRAY['400'],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  is_premium BOOLEAN DEFAULT false,
  subscription_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create collections table
CREATE TABLE public.collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create collection fonts junction table
CREATE TABLE public.collection_fonts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES public.collections(id) ON DELETE CASCADE NOT NULL,
  font_id UUID REFERENCES public.fonts(id) ON DELETE CASCADE NOT NULL,
  added_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(collection_id, font_id)
);

-- Create favorites table
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  font_id UUID REFERENCES public.fonts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, font_id)
);

-- Create ratings table
CREATE TABLE public.ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  font_id UUID REFERENCES public.fonts(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, font_id)
);

-- Enable RLS
ALTER TABLE public.fonts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_fonts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for fonts (public read, admin write)
CREATE POLICY "Fonts are viewable by everyone" ON public.fonts FOR SELECT USING (true);

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for collections
CREATE POLICY "Public collections viewable by everyone" ON public.collections FOR SELECT USING (is_public = true OR user_id = auth.uid());
CREATE POLICY "Users can create collections" ON public.collections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own collections" ON public.collections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own collections" ON public.collections FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for collection_fonts
CREATE POLICY "Collection fonts viewable by collection viewers" ON public.collection_fonts FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.collections 
    WHERE id = collection_id AND (is_public = true OR user_id = auth.uid())
  )
);
CREATE POLICY "Users can add fonts to own collections" ON public.collection_fonts FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.collections WHERE id = collection_id AND user_id = auth.uid())
);
CREATE POLICY "Users can remove fonts from own collections" ON public.collection_fonts FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.collections WHERE id = collection_id AND user_id = auth.uid())
);

-- RLS Policies for favorites
CREATE POLICY "Users can view own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add favorites" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove favorites" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for ratings
CREATE POLICY "Ratings viewable by everyone" ON public.ratings FOR SELECT USING (true);
CREATE POLICY "Users can create ratings" ON public.ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ratings" ON public.ratings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own ratings" ON public.ratings FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_fonts_updated_at BEFORE UPDATE ON public.fonts FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON public.collections FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_ratings_updated_at BEFORE UPDATE ON public.ratings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to update font rating
CREATE OR REPLACE FUNCTION public.update_font_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.fonts
  SET rating = (
    SELECT COALESCE(AVG(rating), 0)
    FROM public.ratings
    WHERE font_id = COALESCE(NEW.font_id, OLD.font_id)
  )
  WHERE id = COALESCE(NEW.font_id, OLD.font_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update font rating when ratings change
CREATE TRIGGER update_font_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.ratings
FOR EACH ROW EXECUTE FUNCTION public.update_font_rating();

-- Function to update favorites count
CREATE OR REPLACE FUNCTION public.update_favorites_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.fonts
  SET favorites_count = (
    SELECT COUNT(*)
    FROM public.favorites
    WHERE font_id = COALESCE(NEW.font_id, OLD.font_id)
  )
  WHERE id = COALESCE(NEW.font_id, OLD.font_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update favorites count
CREATE TRIGGER update_favorites_count_trigger
AFTER INSERT OR DELETE ON public.favorites
FOR EACH ROW EXECUTE FUNCTION public.update_favorites_count();

-- Create trigger for profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();