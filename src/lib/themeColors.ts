/**
 * Theme color system for Real Return Analyzer
 * Notion-inspired palette with warm neutrals
 */

export const themeColors = {
  light: {
    primaryBlue: 'text-[#2383e2]',
    primaryBlueBg: 'bg-[#2383e2]',
    primaryBlueHover: 'hover:bg-[#1b6ec2]',

    secondaryBlue: 'text-blue-100',
    secondaryBlueBg: 'bg-blue-50',
    secondaryBlueAlpha: 'bg-blue-500/10',

    textPrimary: 'text-[#37352f]',
    textSecondary: 'text-[#787774]',

    bgMain: 'bg-white',
    bgAlt: 'bg-[#f7f6f3]',
    bgCard: 'bg-white',
    cardBorder: 'border border-[#e3e2de]',
    cardShadow: '',

    warningRed: 'text-red-600',
    warningRedBg: 'bg-red-50',
    warningRedBorder: 'border-red-200',

    successGreen: 'text-green-600',
    successGreenBg: 'bg-green-50',

    neutralGrey: 'text-[#787774]',
    neutralGreyBg: 'bg-[#e3e2de]',
    neutralBorder: 'border-[#e3e2de]',

    inputBg: 'bg-[#f7f6f3]',
    inputBorder: 'border-[#e3e2de]',
    inputFocus: 'focus:ring-[#2383e2] focus:border-[#2383e2]',
  },

  dark: {
    primaryBlue: 'text-[#529cca]',
    primaryBlueBg: 'bg-[#529cca]',
    primaryBlueHover: 'hover:bg-[#6db3d9]',

    secondaryBlue: 'text-blue-300',
    secondaryBlueBg: 'bg-blue-700/30',
    secondaryBlueAlpha: 'bg-blue-400/10',

    textPrimary: 'text-[#e3e2de]',
    textSecondary: 'text-[#9b9a97]',

    bgMain: 'bg-[#191919]',
    bgAlt: 'bg-[#2f2f2f]',
    bgCard: 'bg-[#202020]',
    cardBorder: 'border border-[#383838]',
    cardShadow: '',

    warningRed: 'text-red-400',
    warningRedBg: 'bg-red-900/30',
    warningRedBorder: 'border-red-800',

    successGreen: 'text-green-400',
    successGreenBg: 'bg-green-900/30',

    neutralGrey: 'text-[#9b9a97]',
    neutralGreyBg: 'bg-[#383838]',
    neutralBorder: 'border-[#383838]',

    inputBg: 'bg-[#2f2f2f]',
    inputBorder: 'border-[#383838]',
    inputFocus: 'focus:ring-[#529cca] focus:border-[#529cca]',
  }
};

export const getThemeColor = (colorKey: string, isDarkMode: boolean): string => {
  const theme = isDarkMode ? themeColors.dark : themeColors.light;
  return (theme as Record<string, string>)[colorKey] || '';
};

export const getThemeColors = (colorKeys: string[], isDarkMode: boolean): string => {
  return colorKeys.map(key => getThemeColor(key, isDarkMode)).join(' ');
};

export const getValueColor = (value: number, isDarkMode: boolean, type: 'text' | 'bg' | 'border' = 'text'): string => {
  const theme = isDarkMode ? themeColors.dark : themeColors.light;

  if (value < 0) {
    switch (type) {
      case 'text': return theme.warningRed;
      case 'bg': return theme.warningRedBg;
      case 'border': return theme.warningRedBorder;
      default: return theme.warningRed;
    }
  } else {
    switch (type) {
      case 'text': return theme.primaryBlue;
      case 'bg': return theme.secondaryBlueBg;
      case 'border': return theme.neutralBorder;
      default: return theme.primaryBlue;
    }
  }
};
