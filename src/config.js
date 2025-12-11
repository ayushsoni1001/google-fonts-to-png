/**
 * Configuration for font preview generation
 */

module.exports = {
  // Image dimensions
  canvas: {
    height: 100,
    minWidth: 200,
    maxWidth: 800,
    padding: 20,
  },

  // Font settings
  font: {
    size: 64,
    color: '#000000',
    weight: 400,
  },

  // Background settings
  background: {
    color: 'transparent', // 'transparent', '#ffffff', etc.
  },

  // Output settings
  output: {
    format: 'png',
    quality: 100,
    directory: 'images',
  },

  // Sample fonts for quick testing (top 25 most popular)
  sampleFonts: [
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Poppins',
    'Oswald',
    'Raleway',
    'Ubuntu',
    'Playfair Display',
    'Merriweather',
    'Nunito',
    'PT Sans',
    'Rubik',
    'Work Sans',
    'Quicksand',
    'Inter',
    'Fira Sans',
    'Barlow',
    'Mulish',
    'Karla',
    'Libre Baskerville',
    'Josefin Sans',
    'Arimo',
    'Cabin',
    'Dancing Script',
  ],
};

