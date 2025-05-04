import { useState, useEffect } from 'react';
import { getSavedSnippets, deleteSnippet, createShareableUrl } from '../utils/storageUtils';

interface SavedSnippetsProps {
  onLoadSnippet: (code: string, language: string) => void;
  theme: 'light' | 'dark';
  updateTrigger?: number;
}

const SavedSnippets = ({ onLoadSnippet, theme, updateTrigger = 0 }: SavedSnippetsProps) => {
  const [snippets, setSnippets] = useState(getSavedSnippets());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');

  useEffect(() => {
    // Update snippets when localStorage changes or updateTrigger changes
    const handleStorageChange = () => {
      setSnippets(getSavedSnippets());
    };

    window.addEventListener('storage', handleStorageChange);
    setSnippets(getSavedSnippets()); // Update immediately when updateTrigger changes
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [updateTrigger]);

  const handleDelete = (id: string) => {
    deleteSnippet(id);
    setSnippets(getSavedSnippets());
  };

  const handleShare = async (code: string, language: string) => {
    const url = createShareableUrl(code, language);
    await navigator.clipboard.writeText(url);
    return url;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get unique languages
  const languages = ['All', ...new Set(snippets.map(snippet => snippet.language))];

  // Filter and sort snippets
  const filteredSnippets = snippets
    .filter(snippet => {
      const matchesSearch = searchTerm === '' || 
        snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snippet.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLanguage = selectedLanguage === 'All' || snippet.language === selectedLanguage;
      return matchesSearch && matchesLanguage;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return b.createdAt - a.createdAt;
      }
      return a.title.localeCompare(b.title);
    });

  if (snippets.length === 0) {
    return (
      <div className={`text-center p-8 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-lg font-medium">No saved snippets yet</p>
        <p className="text-sm mt-1">Save your code snippets to access them later</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-h-[600px]">
      {/* Search and Filter Controls */}
      <div className="flex gap-4 p-4 border-b sticky top-0 z-10 bg-opacity-95 backdrop-blur-sm" style={{
        borderColor: theme === 'light' ? '#e5e7eb' : '#374151',
        backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(31, 41, 55, 0.95)'
      }}>
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search snippets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors duration-200 ${
                theme === 'light'
                  ? 'bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  : 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400'
              }`}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 ${
              theme === 'light' ? 'text-gray-400' : 'text-gray-500'
            }`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className={`px-4 py-2 rounded-lg border transition-colors duration-200 min-w-[120px] ${
              theme === 'light'
                ? 'bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                : 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400'
            }`}
          >
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang.toUpperCase()}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
            className={`px-4 py-2 rounded-lg border transition-colors duration-200 min-w-[120px] ${
              theme === 'light'
                ? 'bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                : 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400'
            }`}
          >
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>
      </div>

      {/* Snippets Grid */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {filteredSnippets.length === 0 ? (
          <div className={`text-center py-8 ${
            theme === 'light' ? 'text-gray-500' : 'text-gray-400'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-medium">No snippets found</p>
            <p className="text-sm mt-1">Try changing your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSnippets.map(snippet => (
              <div
                key={snippet.id}
                className={`p-4 rounded-lg border transition-all duration-200 hover:scale-[1.02] ${
                  theme === 'light'
                    ? 'border-gray-200 hover:border-blue-300 hover:shadow-lg bg-white'
                    : 'border-gray-700 hover:border-blue-500 hover:shadow-lg bg-gray-800'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className={`font-medium ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                      {snippet.title}
                    </h3>
                    <p className={`text-sm ${
                      theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      {formatDate(snippet.createdAt)} · {snippet.language.toUpperCase()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        const url = await handleShare(snippet.code, snippet.language);
                        setCopiedId(snippet.id);
                        setTimeout(() => setCopiedId(null), 2000);
                      }}
                      className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-colors duration-200 ${
                        theme === 'light'
                          ? copiedId === snippet.id
                            ? 'bg-green-100 text-green-700'
                            : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                          : copiedId === snippet.id
                            ? 'bg-green-900/30 text-green-400'
                            : 'bg-purple-900/30 text-purple-400 hover:bg-purple-900/50'
                      }`}
                    >
                      {copiedId === snippet.id ? '✓ Copied!' : 'Share'}
                    </button>
                    <button
                      onClick={() => onLoadSnippet(snippet.code, snippet.language)}
                      className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-colors duration-200 ${
                        theme === 'light'
                          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          : 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50'
                      }`}
                    >
                      Load
                    </button>
                    <button
                      onClick={() => handleDelete(snippet.id)}
                      className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-colors duration-200 ${
                        theme === 'light'
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                      }`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className={`mt-2 p-2 rounded font-mono text-sm overflow-x-auto ${
                  theme === 'light'
                    ? 'bg-gray-50 text-gray-800'
                    : 'bg-gray-900 text-gray-200'
                }`}>
                  <pre className="whitespace-pre-wrap">{snippet.code.slice(0, 150)}{snippet.code.length > 150 ? '...' : ''}</pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedSnippets; 