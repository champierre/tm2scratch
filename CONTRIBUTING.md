# Contributing to TM2Scratch

Thank you for your interest in contributing to TM2Scratch! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Submitting Changes](#submitting-changes)
- [Coding Standards](#coding-standards)
- [Translation Guidelines](#translation-guidelines)

## Code of Conduct

This project follows a friendly and inclusive community approach. Please be respectful and constructive in all interactions.

## How Can I Contribute?

### Reporting Bugs

If you find a bug, please create an issue on GitHub with:
- A clear, descriptive title
- Steps to reproduce the bug
- Expected behavior
- Actual behavior
- Browser version and operating system
- Screenshots (if applicable)

### Suggesting Features

Feature suggestions are welcome! Please create an issue with:
- A clear description of the feature
- Why this feature would be useful
- Examples of how it would work

### Translating

TM2Scratch supports multiple languages. To add or improve translations:
1. Check the `Message` object in `scratch-vm/src/extensions/scratch3_tm2scratch/index.js`
2. Add translations for your language
3. Update `install.sh` to include your language in the `translationMap`
4. Test the extension with your language selected

Currently supported languages:
- Japanese (ja)
- Japanese Hiragana (ja-Hira)
- English (en)
- Korean (ko)
- Chinese Simplified (zh-cn)
- Chinese Traditional (zh-tw)
- German (de)

### Contributing Code

Code contributions are very welcome! See the [Development Setup](#development-setup) section below.

## Development Setup

### Prerequisites

- **Node.js**: Version 14.x or later
- **npm**: Version 6.x or later
- **Git**: For version control
- **Google Chrome**: For testing (recommended browser)

### Initial Setup

1. **Clone the Scratch GUI repository**

   ```bash
   git clone --depth 1 git@github.com:LLK/scratch-gui.git
   cd scratch-gui
   npm install
   ```

   This sets up the base Scratch 3 editor. The `--depth 1` flag creates a shallow clone to save space and time.

2. **Clone TM2Scratch repository**

   Inside the `scratch-gui` folder:

   ```bash
   git clone git@github.com:champierre/tm2scratch.git
   ```

   You will now have a `tm2scratch` folder inside `scratch-gui`.

3. **Run the installation script**

   ```bash
   sh tm2scratch/install.sh
   ```

   This script performs the following operations:
   - Copies the TM2Scratch extension code to `node_modules/scratch-vm/src/extensions/scratch3_tm2scratch/`
   - Registers the extension in the extension manager
   - Copies extension icons to the appropriate folders
   - Updates the extension library to include TM2Scratch

4. **Start the development server**

   ```bash
   npm start
   ```

   The Scratch editor will be available at `http://localhost:8601/`

5. **Test the extension**

   - Open `http://localhost:8601/` in Chrome
   - Click "Choose an Extension"
   - Select "TM2Scratch"
   - Test image and sound classification features

### What the Install Script Does

The `install.sh` script automates the integration of TM2Scratch into Scratch:

1. **Extension Registration**:
   - Modifies `node_modules/scratch-vm/src/extension-support/extension-manager.js`
   - Registers TM2Scratch as a built-in extension

2. **Extension Metadata**:
   - Updates `src/lib/libraries/extensions/index.jsx`
   - Adds TM2Scratch name, icon, description, and translations

3. **Extension Library UI**:
   - Replaces `src/containers/extension-library.jsx`
   - Ensures TM2Scratch appears in the extension selection dialog

4. **Assets**:
   - Copies extension icons (`tm2scratch.png`, `tm2scratch-small.png`)

## Project Structure

```
tm2scratch/
├── README.md                          # Main documentation (Japanese)
├── README.en.md                       # English documentation
├── CHANGELOG.md                       # Version history
├── CONTRIBUTING.md                    # This file
├── LICENSE                            # AGPL-3.0 license
├── install.sh                         # Installation script
├── images/                            # Screenshots and documentation images
│   ├── ja/                           # Japanese screenshots
│   └── en/                           # English screenshots
├── scratch-gui/
│   └── src/
│       ├── lib/libraries/extensions/tm2scratch/
│       │   ├── tm2scratch.png        # Extension icon (large)
│       │   └── tm2scratch-small.png  # Extension icon (small)
│       └── containers/
│           └── extension-library.jsx  # Extension library UI
└── scratch-vm/
    └── src/extensions/scratch3_tm2scratch/
        └── index.js                   # Main extension code
```

### Key Files

- **`index.js`**: The main extension code
  - Defines all blocks (hat blocks, reporters, commands)
  - Handles image and sound classification
  - Manages camera, video, and model loading
  - Contains translations for all supported languages

- **`install.sh`**: Automates the setup process
  - Must be run after any changes to extension code
  - Re-run after updating from upstream Scratch GUI

- **`extension-library.jsx`**: Custom extension library UI
  - Ensures TM2Scratch appears in the extension list
  - May need updates when adding new features

## Making Changes

### Workflow

1. **Create a feature branch**

   ```bash
   cd tm2scratch
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**

   - Edit files in the `tm2scratch` directory (not in `node_modules` or `src`)
   - Follow the [Coding Standards](#coding-standards)

3. **Re-run the install script**

   ```bash
   cd ..  # Back to scratch-gui directory
   sh tm2scratch/install.sh
   ```

   This copies your changes to the correct locations.

4. **Test your changes**

   ```bash
   npm start
   ```

   Test thoroughly in Chrome:
   - Basic functionality
   - Edge cases
   - All supported languages (if applicable)
   - Different browsers (if possible)

5. **Update documentation**

   - Update `README.md` (Japanese) and `README.en.md` (English)
   - Add entry to `CHANGELOG.md` under `[Unreleased]`
   - Update this CONTRIBUTING.md if needed

### Common Development Tasks

#### Adding a New Block

1. Add the block definition in `index.js` in the `getInfo()` method
2. Add translations for all languages in the `Message` object
3. Implement the block's functionality
4. Re-run `install.sh` and test

#### Modifying Existing Functionality

1. Locate the relevant code in `index.js`
2. Make your changes
3. Re-run `install.sh`
4. Test thoroughly to ensure no regressions

#### Adding or Updating Translations

1. Find the `Message` object in `index.js`
2. Add or update translations for each language
3. Update the `translationMap` in `install.sh` if adding new languages
4. Test with each language selected in Scratch

## Submitting Changes

### Pull Request Process

1. **Commit your changes**

   ```bash
   git add .
   git commit -m "Brief description of changes"
   ```

   Write clear commit messages:
   - Use present tense ("Add feature" not "Added feature")
   - Be concise but descriptive
   - Reference issues if applicable (#42)

2. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request**

   - Go to the TM2Scratch repository on GitHub
   - Click "New Pull Request"
   - Select your feature branch
   - Write a clear description:
     - What changes were made
     - Why these changes are needed
     - How to test the changes
     - Screenshots (if UI changes)

4. **Code Review**

   - Respond to feedback from maintainers
   - Make requested changes if needed
   - Be patient and respectful

### Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code follows the [Coding Standards](#coding-standards)
- [ ] All new features have been tested in Chrome
- [ ] Documentation has been updated (README.md, README.en.md)
- [ ] CHANGELOG.md has been updated
- [ ] Translations are complete for all supported languages (if applicable)
- [ ] No console errors or warnings
- [ ] Existing functionality still works

## Coding Standards

### JavaScript Style

- **Indentation**: 4 spaces (not tabs)
- **Semicolons**: Required at the end of statements
- **Naming**:
  - Variables: `camelCase`
  - Constants: `UPPER_CASE`
  - Classes: `PascalCase`
- **Quotes**: Single quotes for strings
- **Comments**: Use JSDoc-style comments for functions

Example:

```javascript
/**
 * Set the confidence threshold for classification.
 * @param {object} args - The block arguments.
 * @param {number} args.CONFIDENCE_THRESHOLD - The threshold value (0.0 to 1.0).
 */
setConfidenceThreshold(args) {
    this.confidenceThreshold = Cast.toNumber(args.CONFIDENCE_THRESHOLD);
}
```

### Block Design Principles

- **Simplicity**: Blocks should be easy to understand
- **Consistency**: Follow existing Scratch block patterns
- **Default Values**: Provide sensible defaults
- **User Feedback**: Show clear error messages when things go wrong

### Testing

- Test with different model URLs (image and sound)
- Test all blocks with various inputs
- Test edge cases (empty inputs, invalid URLs, etc.)
- Test in different lighting conditions (for image recognition)
- Verify translations appear correctly

## Translation Guidelines

### Adding a New Language

1. **Add language to `AvailableLocales`** in `index.js`:

   ```javascript
   const AvailableLocales = ['en', 'ja', 'ja-Hira', 'ko', 'zh-cn', 'zh-tw', 'de', 'your-lang'];
   ```

2. **Add translations to all `Message` entries**:

   ```javascript
   image_label: {
       'ja': '画像ラベル',
       'en': 'image label',
       'your-lang': 'your translation'
   }
   ```

3. **Update `install.sh`** to include your language:

   ```bash
   'your-lang': {${LF}\
       'gui.extension.tm2scratchblocks.description': 'Your translated description'${LF}\
   },${LF}\
   ```

4. **Create screenshot images** in `images/your-lang/` folder

5. **Test** the extension with your language selected

### Translation Tips

- Keep translations concise (Scratch blocks have limited space)
- Use terminology consistent with Scratch in your language
- Test translations in context (not just in isolation)
- Ask native speakers to review if possible

## Questions?

If you have questions about contributing:
- Open a [GitHub Issue](https://github.com/champierre/tm2scratch/issues)
- Check existing issues and pull requests
- Read the [README.md](README.md) and [README.en.md](README.en.md)

## License

By contributing to TM2Scratch, you agree that your contributions will be licensed under the AGPL-3.0 License.

---

Thank you for contributing to TM2Scratch! Your help makes this project better for educators and students around the world. 🎉
