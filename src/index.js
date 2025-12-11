/**
 * Google Fonts to PNG
 * Generate PNG preview images of Google Fonts
 */

const FontGenerator = require('./generator');
const { getAllFontNames, getFontInfo, searchFonts } = require('./fonts');
const config = require('./config');

module.exports = {
  FontGenerator,
  getAllFontNames,
  getFontInfo,
  searchFonts,
  config,
};

