/**
 * Theme color system for Real Return Analyzer
 * This file provides a consistent color palette for both light and dark modes
 * following the design guidelines in the UI/UX enhancement specification.
 */

export const themeColors = {
  light: {
    // Primary brand/action colors
    primaryBlue: 'text-blue-600',         // #2563EB
    primaryBlueBg: 'bg-blue-600',
    primaryBlueHover: 'hover:bg-blue-700',
    
    // Secondary/neutral blue for subtle highlights
    secondaryBlue: 'text-blue-100',
    secondaryBlueBg: 'bg-blue-100',       // Light blue background
    secondaryBlueAlpha: 'bg-blue-500/10', // Semi-transparent
    
    // Text colors
    textPrimary: 'text-gray-900',         // For headings, main content
    textSecondary: 'text-gray-600',       // For subtitles, less important info
    
    // Background colors
    bgMain: 'bg-white',                   // Main page background
    bgAlt: 'bg-gray-50',                  // Alternative light background
    bgCard: 'bg-white',                   // Card background
    cardBorder: 'border border-gray-200', // Card border
    cardShadow: 'shadow-sm',              // Card shadow
    
    // Semantic colors
    warningRed: 'text-red-600',           // #DC2626 - For negative impact, loss
    warningRedBg: 'bg-red-50',            // Very light red background
    warningRedBorder: 'border-red-200',   // Light red border
    
    successGreen: 'text-green-600',       // For positive values
    successGreenBg: 'bg-green-50',
    
    // Neutral elements
    neutralGrey: 'text-gray-500',         // For icons, borders
    neutralGreyBg: 'bg-gray-200',         // For buttons, separators
    neutralBorder: 'border-gray-300',     // For borders
    
    // Form controls
    inputBg: 'bg-gray-50',
    inputBorder: 'border-gray-300',
    inputFocus: 'focus:ring-blue-500 focus:border-blue-500',
  },
  
  dark: {
    // Primary brand/action colors
    primaryBlue: 'text-blue-400',         // #60A5FA
    primaryBlueBg: 'bg-blue-500',
    primaryBlueHover: 'hover:bg-blue-600',
    
    // Secondary/neutral blue for subtle highlights
    secondaryBlue: 'text-blue-300',
    secondaryBlueBg: 'bg-blue-700/30',    // Semi-transparent dark blue
    secondaryBlueAlpha: 'bg-blue-400/10', // Semi-transparent
    
    // Text colors
    textPrimary: 'text-gray-100',         // For headings, main content
    textSecondary: 'text-gray-400',       // For subtitles, less important info
    
    // Background colors
    bgMain: 'bg-gray-900',                // Main page background
    bgAlt: 'bg-gray-800',                 // Alternative dark background
    bgCard: 'bg-gray-800',                // Card background
    cardBorder: 'border border-gray-700', // Card border
    cardShadow: 'shadow-sm',              // Card shadow
    
    // Semantic colors
    warningRed: 'text-red-400',           // #F87171 - For negative impact, loss
    warningRedBg: 'bg-red-900/30',        // Semi-transparent dark red
    warningRedBorder: 'border-red-800',   // Dark red border
    
    successGreen: 'text-green-400',       // For positive values
    successGreenBg: 'bg-green-900/30',
    
    // Neutral elements
    neutralGrey: 'text-gray-500',         // For icons, borders
    neutralGreyBg: 'bg-gray-700',         // For buttons, separators
    neutralBorder: 'border-gray-600',     // For borders
    
    // Form controls
    inputBg: 'bg-gray-700',
    inputBorder: 'border-gray-600',
    inputFocus: 'focus:ring-blue-400 focus:border-blue-400',
  }
};

/**
 * Helper function to get theme-appropriate color classes
 * @param colorKey - The color key in the themeColors object
 * @param isDarkMode - Whether dark mode is enabled
 * @returns The appropriate Tailwind CSS class
 */
export const getThemeColor = (colorKey: string, isDarkMode: boolean): string => {
  const theme = isDarkMode ? themeColors.dark : themeColors.light;
  return theme[colorKey] || '';
};

/**
 * Helper to get multiple theme colors at once
 * @param colorKeys - Array of color keys
 * @param isDarkMode - Whether dark mode is enabled
 * @returns String of combined Tailwind CSS classes
 */
export const getThemeColors = (colorKeys: string[], isDarkMode: boolean): string => {
  return colorKeys.map(key => getThemeColor(key, isDarkMode)).join(' ');
};

/**
 * Get appropriate color class based on value (positive/negative)
 * @param value - The numeric value to check
 * @param isDarkMode - Whether dark mode is enabled
 * @param type - The type of color to return ('text', 'bg', or 'border')
 * @returns Tailwind CSS class for the appropriate color
 */
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
