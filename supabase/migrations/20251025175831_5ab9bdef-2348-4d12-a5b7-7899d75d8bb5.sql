-- Fix security warnings by setting search_path for all functions

-- Fix handle_updated_at function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix update_font_rating function
CREATE OR REPLACE FUNCTION public.update_font_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- Fix update_favorites_count function
CREATE OR REPLACE FUNCTION public.update_favorites_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;