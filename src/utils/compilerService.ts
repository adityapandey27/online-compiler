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
  versionIndex: string;
  stdin?: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function compileCode({
  code,
  language,
  versionIndex,
  stdin = ''
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
        versionIndex,
        stdin,
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

// Language version mapping (common versions)
export const LANGUAGE_VERSIONS = {
  java: '4', // JDK 17
  cpp: '5',  // GCC 11.1.0
  c: '5',    // GCC 11.1.0
  python3: '4', // Python 3.9.9
  nodejs: '4',  // Node.js 17.1.0
  javascript: '4', // Node.js 17.1.0
  typescript: '4', // TypeScript 4.5.4
} as const;

// Supported languages mapping
export const LANGUAGE_NAMES = {
  java: 'java',
  cpp: 'cpp17',
  c: 'c',
  python3: 'python3',
  nodejs: 'nodejs',
  javascript: 'nodejs',
  typescript: 'typescript',
} as const; 