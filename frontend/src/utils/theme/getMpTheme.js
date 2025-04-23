import { getDesignTokens } from './themePrimitives';

/**
 * Returns MUI ThemeOptions based on the given palette mode.
 * @param {string} mode - 'light' or 'dark'
 * @returns {object} ThemeOptions
 */
export default function getMPTheme(mode) {
  console.log(mode)
  return {
    ...getDesignTokens(mode),
  };
}
