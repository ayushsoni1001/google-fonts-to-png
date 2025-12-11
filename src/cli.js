#!/usr/bin/env node

/**
 * CLI for Google Fonts to PNG
 */

const { program } = require('commander');
const chalk = require('chalk');
const cliProgress = require('cli-progress');
const ora = require('ora');
const path = require('path');

const FontGenerator = require('./generator');
const { getAllFontNames, searchFonts } = require('./fonts');
const config = require('./config');

// ASCII art banner
const banner = `
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ${chalk.bold.cyan('Google Fonts → PNG')}                                    ║
║   ${chalk.gray('Generate beautiful font preview images')}                   ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`;

program
  .name('fonts-to-png')
  .description('Generate PNG preview images of Google Fonts')
  .version('1.0.0');

program
  .command('generate')
  .description('Generate font preview images')
  .option('-a, --all', 'Generate previews for all Google Fonts')
  .option('-s, --sample', 'Generate previews for top 25 sample fonts')
  .option('-f, --fonts <fonts...>', 'Generate previews for specific fonts')
  .option('-o, --output <dir>', 'Output directory', 'images')
  .option('--height <pixels>', 'Image height in pixels', '100')
  .option('--font-size <pixels>', 'Font size in pixels', '64')
  .option('--bg <color>', 'Background color (transparent, #ffffff, etc.)', 'transparent')
  .option('--color <color>', 'Text color', '#000000')
  .action(async (options) => {
    console.log(banner);

    const spinner = ora('Initializing...').start();

    try {
      let fontFamilies = [];

      if (options.all) {
        spinner.text = 'Fetching all Google Fonts...';
        fontFamilies = await getAllFontNames();
        spinner.succeed(`Found ${chalk.green(fontFamilies.length)} fonts`);
      } else if (options.sample) {
        fontFamilies = config.sampleFonts;
        spinner.succeed(`Using ${chalk.green(fontFamilies.length)} sample fonts`);
      } else if (options.fonts && options.fonts.length > 0) {
        fontFamilies = options.fonts;
        spinner.succeed(`Processing ${chalk.green(fontFamilies.length)} fonts`);
      } else {
        spinner.fail('No fonts specified. Use --all, --sample, or --fonts <names>');
        process.exit(1);
      }

      // Create generator with options
      const generator = new FontGenerator({
        outputDir: path.resolve(options.output),
        height: parseInt(options.height, 10),
        fontSize: parseInt(options.fontSize, 10),
        backgroundColor: options.bg,
        textColor: options.color,
      });

      // Setup progress bar
      const progressBar = new cliProgress.SingleBar({
        format: `${chalk.cyan('Generating')} |${chalk.cyan('{bar}')}| {percentage}% | {value}/{total} | {font}`,
        barCompleteChar: '█',
        barIncompleteChar: '░',
        hideCursor: true,
      });

      console.log('');
      progressBar.start(fontFamilies.length, 0, { font: 'Starting...' });

      const results = await generator.generateMultiple(fontFamilies, (current, total, fontName, success) => {
        progressBar.update(current, { 
          font: success ? chalk.green(fontName) : chalk.red(fontName) 
        });
      });

      progressBar.stop();
      console.log('');

      // Print summary
      console.log(chalk.bold('\n📊 Summary'));
      console.log(chalk.gray('─'.repeat(40)));
      console.log(`${chalk.green('✓')} Successfully generated: ${chalk.green(results.success.length)}`);
      
      if (results.failed.length > 0) {
        console.log(`${chalk.red('✗')} Failed: ${chalk.red(results.failed.length)}`);
        console.log(chalk.gray('\nFailed fonts:'));
        results.failed.forEach(({ font, error }) => {
          console.log(`  ${chalk.red('•')} ${font}: ${chalk.gray(error)}`);
        });
      }

      console.log(`\n${chalk.gray('Output directory:')} ${chalk.cyan(path.resolve(options.output))}`);
      console.log(chalk.green('\n✨ Done!\n'));

    } catch (error) {
      spinner.fail(`Error: ${error.message}`);
      process.exit(1);
    }
  });

program
  .command('list')
  .description('List available fonts')
  .option('-s, --search <query>', 'Search fonts by name')
  .option('-c, --count', 'Show only the count')
  .action(async (options) => {
    const spinner = ora('Fetching fonts...').start();

    try {
      let fonts;
      
      if (options.search) {
        fonts = await searchFonts(options.search);
        spinner.succeed(`Found ${chalk.green(fonts.length)} fonts matching "${options.search}"`);
      } else {
        fonts = await getAllFontNames();
        spinner.succeed(`Found ${chalk.green(fonts.length)} fonts`);
      }

      if (!options.count) {
        console.log('');
        fonts.forEach((font) => console.log(`  • ${font}`));
      }
    } catch (error) {
      spinner.fail(`Error: ${error.message}`);
      process.exit(1);
    }
  });

program
  .command('sample')
  .description('Show sample fonts list')
  .action(() => {
    console.log(chalk.bold('\n📝 Sample Fonts (Top 25)'));
    console.log(chalk.gray('─'.repeat(40)));
    config.sampleFonts.forEach((font, i) => {
      console.log(`  ${chalk.gray(`${(i + 1).toString().padStart(2)}.`)} ${font}`);
    });
    console.log('');
  });

// Default command - show help
program.action(() => {
  program.help();
});

// Handle --all and --sample as shortcuts
if (process.argv.includes('--all') || process.argv.includes('--sample')) {
  const args = ['node', 'cli.js', 'generate', ...process.argv.slice(2)];
  program.parse(args);
} else {
  program.parse();
}

