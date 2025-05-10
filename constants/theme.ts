export const colors = {
  primary: {
    50: '#E5F0FF',
    100: '#B3D1FF',
    200: '#80B2FF',
    300: '#4D93FF',
    400: '#1A74FF',
    500: '#007AFF', // Electric Blue (Primary)
    600: '#0062CC',
    700: '#004A99',
    800: '#003166',
    900: '#001933',
  },
  secondary: {
    50: '#F5EEFF',
    100: '#E0D0FF',
    200: '#CDB2FF',
    300: '#B794FF',
    400: '#A275FF',
    500: '#7F56D9', // Empowering Purple (Secondary)
    600: '#6644AE',
    700: '#4D3382',
    800: '#332257',
    900: '#19112B',
  },
  accent: {
    50: '#FFEEEC',
    100: '#FFD4CF',
    200: '#FFBAB2',
    300: '#FF9F94',
    400: '#FF8777',
    500: '#FF6F61', // Fiery Orange (Accent)
    600: '#CC594E',
    700: '#99433A',
    800: '#662C27',
    900: '#331613',
  },
  background: {
    50: '#E5E5E9',
    100: '#CCCCDF',
    200: '#B2B2D6',
    300: '#9999CC',
    400: '#7F7FC2',
    500: '#1A1A2E', // Midnight Navy (Background)
    600: '#151525',
    700: '#10101C',
    800: '#0A0A12',
    900: '#050509',
  },
  success: '#34D399',
  warning: '#FBBF24',
  error: '#EF4444',
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};

export const fonts = {
  heading: 'Montserrat-Bold',
  body: 'Poppins-Regular',
  button: 'Roboto-Medium',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
};

export const shadows = {
  sm: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  md: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

export const lightTheme = {
  background: '#FFFFFF',
  text: '#000000',
  primary: '#FF4B91',
  secondary: '#FF8DC7',
  accent: '#FFACC7',
  card: '#F8F9FA',
  border: '#E9ECEF',
  error: '#FF6B6B',
  success: '#51CF66',
  warning: '#FFD43B',
  info: '#339AF0',
};

export const darkTheme = {
  background: '#1A1B1E',
  text: '#FFFFFF',
  primary: '#FF4B91',
  secondary: '#FF8DC7',
  accent: '#FFACC7',
  card: '#2C2E33',
  border: '#373A40',
  error: '#FF6B6B',
  success: '#51CF66',
  warning: '#FFD43B',
  info: '#339AF0',
};

export type Theme = typeof lightTheme;