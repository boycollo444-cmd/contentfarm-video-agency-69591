import { GOOGLE_FONTS_API_KEY, GOOGLE_FONTS_API_URL } from './constants';

export interface GoogleFont {
  family: string;
  variants: string[];
  subsets: string[];
  version: string;
  lastModified: string;
  files: Record<string, string>;
  category: string;
  kind: string;
}

export interface GoogleFontsResponse {
  kind: string;
  items: GoogleFont[];
}

export const fetchGoogleFonts = async (sort: string = 'popularity'): Promise<GoogleFont[]> => {
  const response = await fetch(
    `${GOOGLE_FONTS_API_URL}?key=${GOOGLE_FONTS_API_KEY}&sort=${sort}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch Google Fonts');
  }
  
  const data: GoogleFontsResponse = await response.json();
  return data.items;
};

export const loadGoogleFont = (fontFamily: string, variants: string[] = ['regular']) => {
  const formattedFamily = fontFamily.replace(/ /g, '+');
  const variantsParam = variants.join(',');
  const link = document.createElement('link');
  link.href = `https://fonts.googleapis.com/css2?family=${formattedFamily}:wght@${variantsParam}&display=swap`;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};

export const categorizeFont = (category: string): string => {
  const categoryMap: Record<string, string> = {
    'serif': 'Serif',
    'sans-serif': 'Sans Serif',
    'display': 'Display',
    'handwriting': 'Script',
    'monospace': 'Monospace'
  };
  return categoryMap[category] || 'Sans Serif';
};
