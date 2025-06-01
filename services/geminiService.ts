
import { GoogleGenerativeAI, GenerateContentResponse } from "@google/generative-ai";
import { CodeIssue } from '../types';

// Declare electronAPI for TypeScript to recognize the global object injected by preload.js
declare global {
  interface Window {
    electronAPI: {
      getApiKey: () => Promise<string | undefined>;
    };
  }
}

const modelName = 'gemini-2.5-flash-preview-04-17';

export const SUPPORTED_FILE_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cs', '.go', '.rb', '.php', '.html', '.css', '.json', '.yaml', '.yml', '.md', '.sh', '.swift', '.kt', '.rs'];

// Function to get the GoogleGenAI client instance
// This ensures the API key is fetched and client initialized only when needed
async function getAiClient(): Promise<GoogleGenerativeAI> {
  // First try to get API key from localStorage
  let apiKey: string | undefined;

  try {
    const item = localStorage.getItem('geminiApiKey');
    const storedApiKey: string | null = item ? JSON.parse(item) : null;
    if (storedApiKey) {
      apiKey = storedApiKey;
    }
  } catch (error) {
    console.warn('Failed to get API key from localStorage:', error);
  }

  // Fallback to environment variable via Electron API if no localStorage key
  if (!apiKey && window.electronAPI && typeof window.electronAPI.getApiKey === 'function') {
    try {
      apiKey = await window.electronAPI.getApiKey();
    } catch (error) {
      console.warn('Failed to get API key from Electron API:', error);
    }
  }

  if (!apiKey) {
    // This error will be caught by the calling function (reviewCodeWithGemini)
    // and should be transformed into a user-facing message.
    throw new Error("Google Gemini API key is not configured. Please provide your API key in the application settings or set the API_KEY environment variable.");
  }
  return new GoogleGenerativeAI(apiKey);
}


const generatePrompt = (codeContent: string, filePath: string, filePathsContext?: string): string => {
  let contextPreamble = "";
  if (filePathsContext) {
    const filesInBatch = filePathsContext.split(',').map(s => s.trim()).filter(Boolean);
    if (filesInBatch.length > 1) { // Only add context preamble if more than one file in batch
        contextPreamble = `You are reviewing the file '${filePath}'. This review is part of a batch analysis that also includes these files: ${filePathsContext}. Consider potential interactions or shared concerns among these files if relevant, but focus your specific findings on '${filePath}'.\n\n`;
    }
  }
  
return `${contextPreamble}You are an expert code reviewer. Analyze the following code snippet from the file "${filePath}" for potential issues.
Focus on:
1.  **Performance Bottlenecks**: Identify inefficient code, unnecessary computations, or areas that could lead to slow execution.
2.  **Code Integrity & Bugs**: Find logical errors, potential null pointer exceptions, race conditions, resource leaks, or deviations from best practices that could lead to incorrect behavior.
3.  **Security Vulnerabilities**: Look for common security flaws such as XSS, SQL injection, insecure handling of credentials, buffer overflows, or improper input validation.
4.  **Scalability Concerns**: Point out any design choices or patterns that might hinder the application's ability to handle increased load or data.
5.  **Maintainability & Readability**: Suggest improvements for code clarity, overly complex logic, lack of comments where necessary, or inconsistent coding style.
6.  **Best Practices**: Check for adherence to language-specific best practices and common design patterns.

For each issue found, provide the following information in a JSON array format. Each object in the array should represent a single issue.
The JSON structure for each issue should be:
{
  "lineNumber": "approximate_line_number_as_string_or_empty_string",
  "issueTitle": "A concise title for the issue (max 15 words).",
  "description": "A detailed explanation of the issue, why it's a problem, and potential impact. Be specific to the code provided.",
  "severity": "Critical | High | Medium | Low | Informational",
  "category": "Performance | Security | Integrity | Scalability | Maintainability | BestPractice | Other"
}

If no significant issues are found, return an empty array [].
Only return the JSON array. Do not include any other explanatory text, markdown formatting for the JSON block, or any preamble/apologies.

Code to review (from file: ${filePath}):
---
${codeContent}
---
`;
}

export const reviewCodeWithGemini = async (codeContent: string, filePath: string, filePathsContext?: string): Promise<CodeIssue[]> => {
  try {
    const ai = await getAiClient(); // Get client instance with API key
    const prompt = generatePrompt(codeContent, filePath, filePathsContext);

    const model = ai.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const response = await model.generateContent(prompt);
    let jsonStr = response.response.text().trim();
    
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const rawIssues = JSON.parse(jsonStr) as Omit<CodeIssue, 'id' | 'filePath'>[];
    
    return rawIssues.map((rawIssue, index) => ({
      ...rawIssue,
      id: `${filePath}-${index}-${Date.now()}`,
      filePath: filePath,
      lineNumber: rawIssue.lineNumber || "",
    }));

  } catch (error) {
    console.error(`Error in reviewCodeWithGemini for ${filePath}:`, error);
    let errorMessage = "Failed to analyze code with Gemini.";
    if (error instanceof Error) {
        errorMessage += ` Details: ${error.message}`;
        // Specific check for API key related errors from getAiClient or SDK
        if (error.message.toLowerCase().includes("api key") || // For messages from getAiClient
            error.message.toLowerCase().includes("api_key") ||
            error.message.toLowerCase().includes("permission denied") || // General SDK errors
            error.message.toLowerCase().includes("authentication") ||
            error.message.toLowerCase().includes("electron api") || // For messages from getAiClient
            error.message.toLowerCase().includes("configured") // For new error message
          ) {
            errorMessage = "Failed to analyze code with Gemini. Please check your Google Gemini API key configuration in the application settings or ensure the API_KEY environment variable is set.";
        }
    }
     return [{ 
      id: `${filePath}-error-${Date.now()}`,
      filePath, 
      issueTitle: "Gemini Analysis Failed", 
      description: errorMessage,
      severity: "Critical",
      category: "Other",
      lineNumber: "N/A"
    }];
  }
};