# Costa Rica Adventurers Theme

A custom WordPress child theme built on top of the Adventor parent theme, specifically designed for Costa Rica Adventurers website.

## Description

This child theme extends the functionality of the Adventor theme while maintaining its core features. It includes custom styles and functionality specific to Costa Rica Adventurers' needs.

## Requirements

- WordPress 6.0 or higher
- PHP 7.4 or higher
- Adventor parent theme
- Node.js and npm for asset compilation
- Composer for PHP dependencies

## Installation

1. Install the Adventor parent theme
2. Clone this repository into your WordPress themes directory:
   ```bash
   cd wp-content/themes/
   git clone [repository-url] costarica-adventurers
   ```
3. Install PHP dependencies:
   ```bash
   composer install
   ```
4. Install Node.js dependencies:
   ```bash
   npm install
   ```

## Development

### Available Commands

```bash
# Build assets for production
npm run build

# Start development server with hot reloading
npm run start

# Lint JavaScript files
npm run lint:js

# Lint CSS files
npm run lint:css

# Fix JavaScript issues
npm run fix:js

# Fix CSS issues
npm run fix:css

# Run PHP CodeSniffer
composer run phpcs
```

### File Structure

```
costarica-adventurers/
├── build/                  # Compiled assets
├── src/                    # Source files
│   ├── css/               # CSS/SCSS files
│   └── js/                # JavaScript files
├── functions.php          # Theme functions
├── style.css             # Theme stylesheet
├── composer.json         # PHP dependencies
└── package.json         # Node.js dependencies
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run linting checks
4. Submit a pull request

## License

ISC License - see LICENSE file for details

## Credits

- Parent Theme: [Adventor](https://themeforest.net/item/adventor-tour-travel-wordpress-theme/)
