export const colors = {
  primary: '#FF5A1F',
  primaryPressed: '#E94A10',

  black: '#0B0B0F',
  text: '#17171B',
  textSecondary: '#6E6E73',

  background: '#F7F7F8',
  surface: '#FFFFFF',
  surfaceSecondary: '#F1F1F3',

  border: '#E8E8EA',

  success: '#2E9D63',
  warning: '#F5A623',
  error: '#D92D20',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 999,
};

export const typography = {
  hero: {
    fontSize: 30,
    fontWeight: '800' as const,
    lineHeight: 36,
  },

  heading: {
    fontSize: 22,
    fontWeight: '700' as const,
    lineHeight: 28,
  },

  title: {
    fontSize: 17,
    fontWeight: '700' as const,
    lineHeight: 22,
  },

  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
  },

  caption: {
    fontSize: 13,
    fontWeight: '500' as const,
    lineHeight: 18,
  },
};

export const theme = {
  colors,
  spacing,
  radius,
  typography,
};
