# OpenCodeReviewer

An automated code review tool powered by Google's Gemini AI that analyzes code from GitHub repositories and helps create GitHub issues for identified problems related to performance, security, integrity, and scalability.

## Features

- 🤖 **AI-Powered Analysis**: Uses Google's Gemini AI to perform comprehensive code reviews
- 🔍 **Multi-Category Detection**: Identifies issues in performance, security, integrity, scalability, maintainability, and best practices
- 📊 **GitHub Integration**: Seamlessly fetches repository files and creates GitHub issues
- 🖥️ **Desktop Application**: Built with Electron for a native desktop experience
- 📈 **Progress Tracking**: Real-time progress indicators with time estimates
- 🎯 **File Selection**: Choose specific files or analyze entire repositories
- 🔒 **Secure**: Uses GitHub Personal Access Tokens for authentication

## Supported File Types

- JavaScript/TypeScript (`.js`, `.jsx`, `.ts`, `.tsx`)
- Python (`.py`)
- Java (`.java`)
- C# (`.cs`)
- Go (`.go`)
- Ruby (`.rb`)
- PHP (`.php`)
- HTML/CSS (`.html`, `.css`)
- Configuration files (`.json`, `.yaml`, `.yml`)
- Documentation (`.md`)
- Shell scripts (`.sh`)
- Swift (`.swift`)
- Kotlin (`.kt`)
- Rust (`.rs`)

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- GitHub Personal Access Token with `repo` scope
- Google Gemini API key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/PapaBear1981/OpenCodeReviewer.git
cd OpenCodeReviewer
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add your API keys:
```
GEMINI_API_KEY=your_gemini_api_key_here
GITHUB_CLIENT_ID=your_github_oauth_app_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_app_client_secret
```

4. Build the application:
```bash
npm run build
```

## Usage

1. Start the application:
```bash
npm start
```

2. Choose your GitHub authentication method:
   - **OAuth (Recommended)**: Sign in with your GitHub account for seamless authentication
   - **Personal Access Token**: Enter a GitHub PAT with `repo` scope
3. Provide the repository details (owner, repo name, branch)
4. Select files to analyze
5. Review the AI-generated analysis results
6. Create GitHub issues directly from the application

## Development

To run the application in development mode:

```bash
# Start Vite development server
npm run dev

# In another terminal, start Electron in development mode
NODE_ENV=development npm run electron
```

## Building for Production

```bash
# Build the React application
npm run build

# Run the built application
npm run electron
```

## Project Structure

```
OpenCodeReviewer/
├── components/          # React components
│   ├── AlertMessage.tsx
│   ├── AuthForm.tsx
│   ├── FileList.tsx
│   ├── Icons.tsx
│   ├── LoadingSpinner.tsx
│   ├── ProgressBar.tsx
│   ├── RepoForm.tsx
│   └── ReviewPanel.tsx
├── hooks/              # Custom React hooks
│   └── useLocalStorage.ts
├── services/           # API services
│   ├── geminiService.ts
│   └── githubService.ts
├── dist/              # Built application files
├── App.tsx            # Main React component
├── index.tsx          # React entry point
├── electron-main.js   # Electron main process
├── preload.js         # Electron preload script
├── types.ts           # TypeScript type definitions
└── vite.config.ts     # Vite configuration
```

## Configuration

### GitHub OAuth App (Recommended)

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in the application details:
   - **Application name**: Gemini Code Reviewer
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `gemini-code-reviewer://auth/callback`
4. Copy the Client ID and Client Secret
5. Add them to your `.env` file as `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`

### GitHub Personal Access Token (Alternative)

1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate a new token with `repo` scope
3. Copy the token and paste it in the application when prompted

### Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file as `GEMINI_API_KEY`

## Issue Categories

The AI analyzes code for the following categories:

- **Performance**: Inefficient algorithms, unnecessary computations, memory leaks
- **Security**: XSS vulnerabilities, SQL injection, insecure data handling
- **Integrity**: Logic errors, null pointer exceptions, race conditions
- **Scalability**: Design patterns that don't scale, bottlenecks
- **Maintainability**: Code clarity, complex logic, missing documentation
- **Best Practices**: Language-specific conventions, design patterns

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Google Gemini AI for powering the code analysis
- GitHub API for repository integration
- Electron for the desktop application framework
- React and TypeScript for the user interface

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/PapaBear1981/OpenCodeReviewer/issues) on GitHub.

---

**Note**: This tool is designed to assist with code review and should not replace human code review entirely. Always verify AI suggestions before implementing them.
