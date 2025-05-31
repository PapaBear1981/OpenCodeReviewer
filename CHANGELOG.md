# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2024-05-31

### Added
- Initial release of OpenCodeReviewer
- AI-powered code review using Google Gemini AI
- Desktop application built with Electron and React
- GitHub repository integration for fetching files and creating issues
- Support for multiple programming languages:
  - JavaScript/TypeScript (.js, .jsx, .ts, .tsx)
  - Python (.py)
  - Java (.java)
  - C# (.cs)
  - Go (.go)
  - Ruby (.rb)
  - PHP (.php)
  - HTML/CSS (.html, .css)
  - Configuration files (.json, .yaml, .yml)
  - Documentation (.md)
  - Shell scripts (.sh)
  - Swift (.swift)
  - Kotlin (.kt)
  - Rust (.rs)
- Real-time progress tracking with time estimates
- File selection interface for targeted analysis
- Issue categorization (Performance, Security, Integrity, Scalability, Maintainability, Best Practices)
- Comprehensive documentation and setup guide
- MIT License
- GitHub Actions ready structure

### Features
- 🤖 AI-powered analysis with detailed issue descriptions
- 🔍 Multi-category issue detection
- 📊 GitHub integration for seamless workflow
- 🖥️ Native desktop experience
- 📈 Progress tracking with ETA
- 🎯 Selective file analysis
- 🔒 Secure authentication with GitHub PAT

### Technical Details
- Built with React 19 and TypeScript
- Electron for desktop application
- Vite for build tooling
- Tailwind CSS for styling
- Google Gemini AI for code analysis
- GitHub API integration
- Local storage for user preferences
