-- Add google_font_family column to fonts table
ALTER TABLE public.fonts 
ADD COLUMN IF NOT EXISTS google_font_family TEXT;