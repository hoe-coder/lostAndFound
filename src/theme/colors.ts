export const brandAccent = '#5A2A86';
export const brandAccentOnDark = '#C8A5E8';

export function getAccentColors(dark: boolean) {
  return dark
    ? { accent: brandAccentOnDark, onAccent: '#0F172A' }
    : { accent: brandAccent, onAccent: '#FFFFFF' };
}
