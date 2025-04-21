interface CodeSnippet {
  id: string;
  code: string;
  language: string;
  title: string;
  createdAt: number;
}

// Generate a unique ID for snippets
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Save code to localStorage
export const saveCodeSnippet = (code: string, language: string, title: string): CodeSnippet => {
  const snippets = getSavedSnippets();
  const newSnippet: CodeSnippet = {
    id: generateId(),
    code,
    language,
    title,
    createdAt: Date.now(),
  };
  
  snippets.push(newSnippet);
  localStorage.setItem('codeSnippets', JSON.stringify(snippets));
  return newSnippet;
};

// Get all saved snippets
export const getSavedSnippets = (): CodeSnippet[] => {
  const snippets = localStorage.getItem('codeSnippets');
  return snippets ? JSON.parse(snippets) : [];
};

// Delete a snippet
export const deleteSnippet = (id: string): void => {
  const snippets = getSavedSnippets();
  const filteredSnippets = snippets.filter(snippet => snippet.id !== id);
  localStorage.setItem('codeSnippets', JSON.stringify(filteredSnippets));
};

// Create shareable URL
export const createShareableUrl = (code: string, language: string): string => {
  const data = { code, language };
  const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
  return `${window.location.origin}${window.location.pathname}?share=${encoded}`;
};

// Parse shared URL
export const parseSharedCode = (url: string): { code: string; language: string } | null => {
  try {
    const params = new URLSearchParams(url);
    const encoded = params.get('share');
    if (!encoded) return null;
    
    const decoded = decodeURIComponent(atob(encoded));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error parsing shared code:', error);
    return null;
  }
}; 