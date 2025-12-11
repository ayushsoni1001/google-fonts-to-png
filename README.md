# Google Fonts → PNG

<p align="center">
  <strong>Generate beautiful PNG preview images of Google Fonts</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#api">API</a> •
  <a href="#examples">Examples</a>
</p>

---

## ✨ Features

- **🚀 No Native Dependencies** — Uses Playwright for rendering, no Python or C++ compilation required
- **🎨 1700+ Fonts** — Access to the entire Google Fonts library
- **⚡ Fast** — Headless browser rendering with automatic font loading
- **🎯 Customizable** — Control image size, colors, font size, and background
- **📦 CLI & API** — Use from command line or import as a module
- **🌈 Transparent Background** — Generate PNGs with transparent backgrounds
- **📊 Progress Tracking** — Beautiful CLI with progress bars and summaries

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/ayushsoni1001/google-fonts-to-png.git
cd google-fonts-to-png

# Install dependencies
npm install
```

The first run will automatically download Chromium for Playwright (~150MB).

### Global Installation

```bash
npm install -g .
```

Now you can use `fonts-to-png` from anywhere!

## 🚀 Usage

### CLI Commands

#### Generate font previews

```bash
# Generate sample fonts (top 25 popular fonts)
npm run generate:sample

# Generate ALL Google Fonts (~1700+ fonts)
npm run generate

# Or use the CLI directly
npx fonts-to-png generate --sample
npx fonts-to-png generate --all
npx fonts-to-png generate --fonts "Roboto" "Open Sans" "Lato"
```

#### List available fonts

```bash
# List all fonts
npx fonts-to-png list

# Search for fonts
npx fonts-to-png list --search "sans"

# Show only count
npx fonts-to-png list --count
```

#### View sample fonts

```bash
npx fonts-to-png sample
```

### CLI Options

```
Usage: fonts-to-png generate [options]

Options:
  -a, --all              Generate previews for all Google Fonts
  -s, --sample           Generate previews for top 25 sample fonts
  -f, --fonts <fonts...> Generate previews for specific fonts
  -o, --output <dir>     Output directory (default: "images")
  --height <pixels>      Image height in pixels (default: "100")
  --font-size <pixels>   Font size in pixels (default: "64")
  --bg <color>           Background color (default: "transparent")
  --color <color>        Text color (default: "#000000")
  -h, --help             Display help
```

### Examples

```bash
# Custom styling
npx fonts-to-png generate --sample --bg "#ffffff" --color "#333333" --height 120

# Save to custom directory
npx fonts-to-png generate --fonts "Montserrat" "Poppins" -o ./my-fonts

# Generate with larger font size
npx fonts-to-png generate --sample --font-size 80
```

## 📚 API

You can also use this as a Node.js module:

```javascript
const { FontGenerator, getAllFontNames } = require('google-fonts-to-png');

async function main() {
  // Get all available fonts
  const fonts = await getAllFontNames();
  console.log(`Found ${fonts.length} fonts`);

  // Create a generator
  const generator = new FontGenerator({
    outputDir: './images',
    height: 100,
    fontSize: 64,
    backgroundColor: 'transparent',
    textColor: '#000000',
  });

  // Generate a single preview
  await generator.initialize();
  const path = await generator.generatePreview('Roboto');
  console.log(`Generated: ${path}`);
  await generator.close();

  // Or generate multiple with progress
  const results = await generator.generateMultiple(
    ['Roboto', 'Open Sans', 'Lato'],
    (current, total, fontName, success) => {
      console.log(`[${current}/${total}] ${fontName}: ${success ? '✓' : '✗'}`);
    }
  );

  console.log(`Success: ${results.success.length}`);
  console.log(`Failed: ${results.failed.length}`);
}

main();
```

### FontGenerator Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `outputDir` | `string` | `'./images'` | Directory to save generated images |
| `height` | `number` | `100` | Height of the generated image in pixels |
| `fontSize` | `number` | `64` | Font size in pixels |
| `backgroundColor` | `string` | `'transparent'` | Background color (`'transparent'`, `'#ffffff'`, etc.) |
| `textColor` | `string` | `'#000000'` | Text color |

### Available Functions

| Function | Description |
|----------|-------------|
| `getAllFontNames()` | Returns array of all Google Font family names |
| `getFontInfo(fontFamily)` | Returns info for a specific font |
| `searchFonts(query)` | Search fonts by name |

## 📁 Output

Generated images are saved as PNG files named after the font family:

```
images/
├── Roboto.png
├── Open_Sans.png
├── Lato.png
├── Montserrat.png
└── ...
```

Each image displays the font family name rendered in that font:

| Font | Preview |
|------|---------|
| Roboto | ![Roboto](images/Roboto.png) |
| Playfair Display | ![Playfair Display](images/Playfair_Display.png) |
| Dancing Script | ![Dancing Script](images/Dancing_Script.png) |

## 🛠 Requirements

- **Node.js** 18.0.0 or higher
- **npm** or **yarn**
- ~150MB disk space for Chromium (downloaded automatically)

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [Google Fonts](https://fonts.google.com/) for the amazing font library
- [Playwright](https://playwright.dev/) for headless browser automation
- [@remotion/google-fonts](https://www.remotion.dev/docs/google-fonts/) for the font metadata


