/**
 * Font Preview Generator using Playwright
 * Generates PNG images of Google Fonts without native dependencies
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const config = require('./config');

class FontGenerator {
  constructor(options = {}) {
    this.options = {
      outputDir: options.outputDir || path.join(process.cwd(), config.output.directory),
      height: options.height || config.canvas.height,
      backgroundColor: options.backgroundColor || config.background.color,
      textColor: options.textColor || config.font.color,
      fontSize: options.fontSize || config.font.size,
    };
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    // Ensure output directory exists
    if (!fs.existsSync(this.options.outputDir)) {
      fs.mkdirSync(this.options.outputDir, { recursive: true });
    }

    // Launch browser
    this.browser = await chromium.launch({
      headless: true,
    });
    this.page = await this.browser.newPage();
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }

  /**
   * Generate a PNG preview for a single font
   * @param {string} fontFamily - The Google Font family name
   * @returns {Promise<string>} - Path to the generated image
   */
  async generatePreview(fontFamily) {
    if (!this.browser) {
      await this.initialize();
    }

    const { height, backgroundColor, textColor, fontSize } = this.options;
    const bgStyle = backgroundColor === 'transparent' ? 'transparent' : backgroundColor;

    // Create HTML that loads the Google Font and renders it
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily.replace(/ /g, '+'))}&display=swap" rel="stylesheet">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            background: ${bgStyle};
            display: flex;
            align-items: center;
            justify-content: flex-start;
            height: ${height}px;
            overflow: hidden;
          }
          .font-preview {
            font-family: '${fontFamily}', sans-serif;
            font-size: ${fontSize}px;
            font-weight: 400;
            color: ${textColor};
            white-space: nowrap;
            padding: 0 ${config.canvas.padding}px;
            line-height: 1;
          }
        </style>
      </head>
      <body>
        <div class="font-preview" id="text">${fontFamily}</div>
      </body>
      </html>
    `;

    await this.page.setContent(html);
    
    // Wait for the font to load
    await this.page.waitForFunction(() => {
      return document.fonts.ready;
    });
    
    // Small delay to ensure font is fully rendered
    await this.page.waitForTimeout(100);

    // Get the text element's bounding box
    const textElement = await this.page.$('#text');
    const boundingBox = await textElement.boundingBox();

    // Set viewport to match content
    const width = Math.min(
      Math.max(Math.ceil(boundingBox.width + config.canvas.padding * 2), config.canvas.minWidth),
      config.canvas.maxWidth
    );

    await this.page.setViewportSize({ width, height });

    // Take screenshot
    const fileName = `${fontFamily.replace(/\s+/g, '_')}.png`;
    const outputPath = path.join(this.options.outputDir, fileName);

    await this.page.screenshot({
      path: outputPath,
      omitBackground: backgroundColor === 'transparent',
      clip: {
        x: 0,
        y: 0,
        width,
        height,
      },
    });

    return outputPath;
  }

  /**
   * Generate previews for multiple fonts
   * @param {string[]} fontFamilies - Array of font family names
   * @param {Function} onProgress - Progress callback (current, total, fontName)
   * @returns {Promise<{success: string[], failed: {font: string, error: string}[]}>}
   */
  async generateMultiple(fontFamilies, onProgress = null) {
    const results = {
      success: [],
      failed: [],
    };

    await this.initialize();

    for (let i = 0; i < fontFamilies.length; i++) {
      const fontFamily = fontFamilies[i];
      
      try {
        const outputPath = await this.generatePreview(fontFamily);
        results.success.push(outputPath);
        
        if (onProgress) {
          onProgress(i + 1, fontFamilies.length, fontFamily, true);
        }
      } catch (error) {
        results.failed.push({ font: fontFamily, error: error.message });
        
        if (onProgress) {
          onProgress(i + 1, fontFamilies.length, fontFamily, false);
        }
      }
    }

    await this.close();
    return results;
  }
}

module.exports = FontGenerator;

