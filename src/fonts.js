/**
 * Google Fonts utilities
 * Fetches available fonts from @remotion/google-fonts
 */

const googleFonts = require('@remotion/google-fonts');

/**
 * Get all available Google Font family names
 * @returns {Promise<string[]>} Array of font family names
 */
async function getAllFontNames() {
  const fonts = await googleFonts.getAvailableFonts();
  return fonts.map((font) => font.fontFamily);
}

/**
 * Get font info for a specific font
 * @param {string} fontFamily - Font family name
 * @returns {Promise<object|null>} Font info or null if not found
 */
async function getFontInfo(fontFamily) {
  const fonts = await googleFonts.getAvailableFonts();
  return fonts.find((font) => font.fontFamily === fontFamily) || null;
}

/**
 * Search for fonts by name
 * @param {string} query - Search query
 * @returns {Promise<string[]>} Matching font family names
 */
async function searchFonts(query) {
  const fonts = await googleFonts.getAvailableFonts();
  const lowerQuery = query.toLowerCase();
  return fonts
    .filter((font) => font.fontFamily.toLowerCase().includes(lowerQuery))
    .map((font) => font.fontFamily);
}

module.exports = {
  getAllFontNames,
  getFontInfo,
  searchFonts,
};

