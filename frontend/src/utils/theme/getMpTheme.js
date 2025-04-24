import { getDesignTokens } from './themePrimitives';

/**
 * Returns MUI ThemeOptions based on the given palette mode.
 * @param {string} mode - 'light' or 'dark'
 * @returns {object} ThemeOptions
 */
export default function getMPTheme(mode) {
  return {
    ...getDesignTokens(mode),
  };
}
