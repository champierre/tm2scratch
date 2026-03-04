# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive documentation including troubleshooting and FAQ sections
- Multi-language support information in README
- Advanced features documentation (confidence threshold, classification interval, etc.)
- Technical specifications section
- CONTRIBUTING.md with development setup guide

## [2.0.0] - 2024-03-05

### Added
- Generation AI support for K-12 education
- GDPR-compliant, privacy-focused alternative to Teachable Machine
- iPad support through Generation AI integration

### Changed
- Default branch renamed from `master` to `main`

## [1.9.0] - 2023-06-XX

### Fixed
- Sound classification model URL loading bug (#46)

### Added
- Sample model URLs for all supported languages (not just Japanese)

## [1.8.0] - 2023-05-XX

### Added
- German language support (#42, #44)
- Korean translation updates (#36)

### Changed
- German translation improvements (Treffsicherheit → Konfidenz) (#45)

## [1.7.0] - 2023-04-XX

### Added
- Camera switching functionality (#41)
- Support for multiple camera devices
- Switch webcam block to select between available cameras

### Changed
- Allow loading models from alternative Teachable Machine URLs (#44)

## [1.6.0] - 2023-03-XX

### Fixed
- Sound model loading error
- Model URL caching issue by adding timestamp (#39)

### Changed
- Camera image edge handling - horizontal edges are now ignored, using only center square area
- Extension description now supports localization

## [1.5.0] - 2022-XX-XX

### Changed
- ml5.js is now loaded automatically, no manual installation required

## [1.4.0] - 2021-XX-XX

### Added
- Confidence threshold setting block
- Classification interval control block
- Video toggle block (on/off/flipped)
- Classification on/off toggle

### Changed
- Default camera resolution set to 360×360 pixels
- Default confidence threshold set to 0.5
- Default classification interval set to 1.0 second
- Minimum classification interval set to 0.1 seconds (100ms)

## [1.3.0] - 2021-XX-XX

### Added
- Sound classification support
- Audio recognition blocks
- "when received sound label" hat block
- Sound label confidence reporter block

## [1.2.0] - 2020-XX-XX

### Added
- Chinese Simplified (zh-cn) language support
- Chinese Traditional (zh-tw) language support
- Korean (ko) language support

## [1.1.0] - 2020-XX-XX

### Added
- Japanese Hiragana (ja-Hira) language support for younger learners

## [1.0.0] - 2020-XX-XX

### Added
- Initial release of TM2Scratch
- Image classification support using Google Teachable Machine models
- Integration with Scratch 3
- Japanese and English language support
- Basic blocks:
  - Load image classification model URL
  - "when received image label" hat block
  - Image label confidence reporter block
  - Image label detected boolean block
- ml5.js integration for machine learning
- TensorFlow.js support
- WebGL GPU acceleration
- AGPL-3.0 license

### Technical Details
- Camera resolution: 360×360 pixels
- Browser: Chrome (recommended)
- Offline capability after initial model load

## Legend

- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Vulnerability fixes

---

For detailed commit history, see [GitHub commits](https://github.com/champierre/tm2scratch/commits/).
For issues and feature requests, see [GitHub Issues](https://github.com/champierre/tm2scratch/issues).
