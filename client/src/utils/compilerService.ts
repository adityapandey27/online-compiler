import { languageArray } from "../data/languagesSupported";

interface CompilerResponse {
  output: string;
  statusCode: number;
  memory: string;
  cpuTime: string;
  error?: string;
}

interface CompilerRequest {
  code: string;
  language: string;
  version: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function compileCode({
  code,
  language,
  version,
}: CompilerRequest): Promise<CompilerResponse> {
  try {
    const response = await fetch(`${API_URL}/api/compile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        language,
        version,
      }),
    });
    

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
      return {
        output: '',
        statusCode: response.status,
        memory: '0',
        cpuTime: '0',
        error: data.error
      };
    }

    return {
      output: data.output,
      statusCode: response.status,
      memory: data.memory,
      cpuTime: data.cpuTime,
      error: undefined
    };
  } catch (error) {
    
    return {
      output: '',
      statusCode: 500,
      memory: '0',
      cpuTime: '0',
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

// Language version mapping (for Piston API, default '*' to match any installed version)
// export const LANGUAGE_VERSIONS = {
//   java: '*',
//   cpp: '*',
//   c: '*',
//   python3: '*',
//   nodejs: '*',
//   javascript: '*',
//   typescript: '*',
// } as const;

// // Supported languages mapping
// export const LANGUAGE_NAMES = {
//   java: 'java',
//   cpp: 'cpp17',
//   c: 'c',
//   python3: 'python',
//   nodejs: 'node',     // use `node` for JavaScript
//   javascript: 'javascript',
//   typescript: 'typescript',
// } as const; 

export const LANGUAGE_VERSIONS: Record<string, string> = languageArray.reduce((acc, lang) => {
  acc[lang.language] = lang.version;
  lang.aliases.forEach(alias => {
    acc[alias] = lang.version;
  });
  return acc;
}, {} as Record<string, string>);

export const LANGUAGE_NAMES: Record<string, string> = languageArray.reduce((acc, lang) => {
  acc[lang.language] = lang.language;
  lang.aliases.forEach(alias => {
    acc[alias] = lang.language;
  });
  return acc;
}, {} as Record<string, string>);