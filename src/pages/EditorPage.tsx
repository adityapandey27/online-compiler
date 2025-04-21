import { useState, useEffect } from 'react';
import CodeEditor from '../components/CodeEditor';
import OutputBox from '../components/OutputBox';
import SavedSnippets from '../components/SavedSnippets';
import TemplateLibrary from '../components/TemplateLibrary';
import RunButton from '../components/RunButton';
import { compileCode, LANGUAGE_VERSIONS, LANGUAGE_NAMES } from '../utils/compilerService';
import { saveCodeSnippet, parseSharedCode, createShareableUrl } from '../utils/storageUtils';
import logo from '../assets/logo.svg';
import SnippetsModal from '../components/SnippetsModal';

interface CompileResult {
  output: string;
  error?: string;
}

const DEFAULT_CODE = `// Test your code here
console.log("Hello, World!");
console.log("Current time:", new Date().toISOString());`;

const EditorPage = () => {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [language, setLanguage] = useState('javascript');
  const [isCompiling, setIsCompiling] = useState(false);
  const [result, setResult] = useState<CompileResult | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [snippetTitle, setSnippetTitle] = useState('');
  const [showSnippets, setShowSnippets] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [snippetsUpdateTrigger, setSnippetsUpdateTrigger] = useState(0);
  const [isShareCopied, setIsShareCopied] = useState(false);

  // Check for shared code in URL
  useEffect(() => {
    const shared = parseSharedCode(window.location.search);
    if (shared) {
      setCode(shared.code);
      setLanguage(shared.language);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard shortcuts if not in a modal
      if (showSaveDialog || showTemplates) return;
      
      // Ctrl/Cmd + Enter to run code
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (code.trim()) {
          handleRunCode();
        }
      }
      
      // Ctrl/Cmd + S to save snippet
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        setShowSaveDialog(true);
      }
      
      // Ctrl/Cmd + Shift + S to share
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        handleShare();
      }
      
      // Ctrl/Cmd + T to open templates
      if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        setShowTemplates(true);
      }
      
      // Ctrl/Cmd + Shift + T to toggle snippets
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        setShowSnippets(prev => !prev);
      }
      
      // Ctrl/Cmd + B to toggle theme
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        handleThemeToggle();
      }
      
      // Ctrl/Cmd + R to reset code
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        handleReset();
      }

      // Alt + T to open templates
      if (e.altKey && e.key === 't') {
        e.preventDefault();
        setShowTemplates(true);
      }
      
      // Alt + S to toggle snippets
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        setShowSnippets(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, showSaveDialog, showTemplates, showSnippets]);

  const languages = ['javascript', 'python3', 'java', 'cpp', 'typescript'];

  const handleThemeToggle = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleRunCode = async () => {
    setIsCompiling(true);
    setResult(null);

    try {
      if (!import.meta.env.VITE_JDOODLE_CLIENT_ID || !import.meta.env.VITE_JDOODLE_CLIENT_SECRET) {
        throw new Error(
          'JDoodle API credentials are not configured.\n\n' +
          'Please add your credentials to the .env file:\n' +
          'VITE_JDOODLE_CLIENT_ID=your_client_id\n' +
          'VITE_JDOODLE_CLIENT_SECRET=your_client_secret\n\n' +
          'You can get these from https://www.jdoodle.com/compiler-api/'
        );
      }

      // Get the appropriate language name and version for JDoodle
      const langName = LANGUAGE_NAMES[language as keyof typeof LANGUAGE_NAMES] || language;
      const langVersion = LANGUAGE_VERSIONS[language as keyof typeof LANGUAGE_VERSIONS] || '0';

      const response = await compileCode({
        code,
        language: langName,
        versionIndex: langVersion,
      });

      setResult({
        output: response.output,
        error: response.error,
      });
    } catch (error) {
      setResult({
        output: '',
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    } finally {
      setIsCompiling(false);
    }
  };

  const handleSave = () => {
    if (!snippetTitle.trim()) return;
    saveCodeSnippet(code, language, snippetTitle);
    setShowSaveDialog(false);
    setSnippetTitle('');
    setSnippetsUpdateTrigger(prev => prev + 1);
  };

  const handleShare = async () => {
    const url = createShareableUrl(code, language);
    await navigator.clipboard.writeText(url);
    setShareUrl(url);
    setIsShareCopied(true);
    setTimeout(() => {
      setShareUrl(null);
      setIsShareCopied(false);
    }, 2000);
  };

  const handleReset = () => {
    setCode(DEFAULT_CODE);
    setResult(null);
    setIsCompiling(false);
    setShareUrl(null);
    setShowSaveDialog(false);
    setSnippetTitle('');
  };

  const handleSelectTemplate = (templateCode: string) => {
    setCode(templateCode);
    setShowTemplates(false);
  };

  const buttonBaseClasses = "h-10 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center";
  const selectBaseClasses = "h-10 px-3 rounded-lg font-medium border transition-colors duration-200 appearance-none cursor-pointer flex items-center";

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`}>
      <div className="container mx-auto px-4 py-2">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-2">
              <img src={logo} alt="Logo" className="h-8 w-8" />
              <h1 
                className={`text-2xl font-bold cursor-pointer ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}
                onClick={handleReset}
              >
                Code Editor
              </h1>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <div className="relative group">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={`
                    appearance-none cursor-pointer
                    pl-4 pr-8 py-2 
                    rounded-lg text-sm font-medium
                    border transition-colors duration-150
                    ${theme === 'light'
                      ? 'bg-white text-gray-900 border-gray-200'
                      : 'bg-gray-900 text-gray-100 border-gray-800'
                    }
                    hover:border-gray-700
                    focus:outline-none
                  `}
                  style={{
                    WebkitAppearance: 'none',
                    MozAppearance: 'none'
                  }}
                >
                  {languages.map((lang) => (
                    <option 
                      key={lang} 
                      value={lang}
                      className={`py-2 px-4`}
                    >
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </option>
                  ))}
                </select>
                <div className={`absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                  theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
              <button
                onClick={() => setShowTemplates(true)}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  theme === 'light'
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                Templates
              </button>
              <button
                onClick={() => setShowSnippets(true)}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  theme === 'light'
                    ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                }`}
              >
                Snippets
              </button>
              <button
                onClick={handleThemeToggle}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  theme === 'light'
                    ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                }`}
              >
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Editor Section */}
            <div className="flex-1 min-w-0">
              <div className={`rounded-lg border ${
                theme === 'light' ? 'border-gray-200' : 'border-gray-700'
              }`}>
                <CodeEditor
                  language={language}
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  theme={theme}
                  height="600px"
                  width="100%"
                />
              </div>
            </div>

            {/* Output Section */}
            <div className="w-full lg:w-1/3">
              <div className={`rounded-lg border p-4 ${
                theme === 'light' ? 'border-gray-200' : 'border-gray-700'
              }`}>
                <h2 className={`text-lg font-semibold mb-4 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  Output
                </h2>
                <OutputBox
                  output={result?.output || ''}
                  error={result?.error}
                  isLoading={isCompiling}
                  theme={theme}
                />
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex  gap-3">
                <RunButton
                  onClick={handleRunCode}
                  isLoading={isCompiling}
                  theme={theme}
                />
                <button
                  onClick={() => setShowSaveDialog(true)}
                  className={`px-6 py-2.5 rounded-lg font-semibold shadow-lg transform transition-all duration-200
                    hover:scale-105 active:scale-95 ${
                    theme === 'light'
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  Save
                </button>
                <button
                  onClick={handleShare}
                  className={`px-6 py-2.5 rounded-lg font-semibold shadow-lg transform transition-all duration-200
                    hover:scale-105 active:scale-95 flex items-center gap-2 ${
                    isShareCopied
                      ? theme === 'light'
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                      : theme === 'light'
                        ? 'bg-purple-500 hover:bg-purple-600 text-white'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  {isShareCopied ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      <span>Share</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showTemplates && (
        <TemplateLibrary
          theme={theme}
          currentLanguage={language}
          onSelectTemplate={handleSelectTemplate}
          onClose={() => setShowTemplates(false)}
        />
      )}

      {showSnippets && (
        <SnippetsModal
          theme={theme}
          onLoadSnippet={(code, language) => {
            setCode(code);
            setLanguage(language);
            setShowSnippets(false);
          }}
          onClose={() => setShowSnippets(false)}
          updateTrigger={snippetsUpdateTrigger}
        />
      )}

      {/* Save Dialog Modal */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className={`rounded-lg p-4 sm:p-6 w-full max-w-md shadow-xl ${
            theme === 'light' ? 'bg-white' : 'bg-gray-800'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              Save Code Snippet
            </h3>
            <input
              type="text"
              placeholder="Enter a title for your snippet"
              value={snippetTitle}
              onChange={(e) => setSnippetTitle(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border mb-4 transition-colors duration-200 ${
                theme === 'light'
                  ? 'bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  : 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400'
              }`}
            />
            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              <button
                onClick={() => setShowSaveDialog(false)}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  theme === 'light'
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!snippetTitle.trim()}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  theme === 'light'
                    ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300'
                    : 'bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-800'
                }`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorPage; 