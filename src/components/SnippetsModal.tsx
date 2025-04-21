import React, { useState } from "react";
import { format } from "date-fns";

interface Snippet {
  id: string;
  title: string;
  code: string;
  language: string;
  createdAt: string;
}

interface SnippetsModalProps {
  theme: "light" | "dark";
  onClose: () => void;
  onLoadSnippet: (code: string, language: string) => void;
  updateTrigger: number;
}

const SnippetsModal: React.FC<SnippetsModalProps> = ({
  theme,
  onClose,
  onLoadSnippet,
  updateTrigger,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [snippets, setSnippets] = useState<Snippet[]>(() => {
    const savedSnippets = localStorage.getItem("codeSnippets");
    return savedSnippets ? JSON.parse(savedSnippets) : [];
  });

  // Update snippets when updateTrigger changes
  React.useEffect(() => {
    const savedSnippets = localStorage.getItem("codeSnippets");
    setSnippets(savedSnippets ? JSON.parse(savedSnippets) : []);
  }, [updateTrigger]);

  const handleDelete = (id: string) => {
    const updatedSnippets = snippets.filter((snippet) => snippet.id !== id);
    localStorage.setItem("codeSnippets", JSON.stringify(updatedSnippets));
    setSnippets(updatedSnippets);
  };

  const filteredAndSortedSnippets = React.useMemo(() => {
    const filtered = snippets.filter((snippet) =>
      snippet.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
    });
  }, [snippets, searchTerm, sortOrder]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className={`w-full max-w-3xl rounded-xl shadow-2xl ${
          theme === "light" ? "bg-white" : "bg-gray-900"
        }`}
        style={{
          minHeight: "80%",
          maxHeight: "80%",
          overflowY: "auto"
        }}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b ${
            theme === "light" ? "border-gray-200" : "border-gray-700"
          }`}
        >
          <h2
            className={`text-xl font-semibold ${
              theme === "light" ? "text-gray-900" : "text-white"
            }`}
          >
            Saved Snippets
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg hover:bg-opacity-80 transition-colors ${
              theme === "light" ? "hover:bg-gray-200" : "hover:bg-gray-200"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search snippets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full px-4 py-2 pl-10 rounded-lg border ${
                  theme === "light"
                    ? "bg-white border-gray-300 focus:border-blue-500"
                    : "bg-gray-800 border-gray-700 focus:border-blue-600"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
              />
              <svg
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none ${
                  theme === "light" ? "text-gray-400" : "text-gray-500"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "latest" | "oldest")}
              className={`px-4 py-2 rounded-lg border ${
                theme === "light"
                  ? "bg-white border-gray-300 text-gray-700"
                  : "bg-gray-800 border-gray-700 text-gray-200"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {/* Snippets List */}
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {filteredAndSortedSnippets.length === 0 ? (
              <div
                className={`text-center py-8 ${
                  theme === "light" ? "text-gray-500" : "text-gray-400"
                }`}
              >
                No snippets found
              </div>
            ) : (
              filteredAndSortedSnippets.map((snippet) => (
                <div
                  key={snippet.id}
                  className={`p-4 rounded-lg border ${
                    theme === "light"
                      ? "border-gray-200 hover:border-gray-300 bg-gray-50"
                      : "border-gray-700 hover:border-gray-600 bg-gray-800/50"
                  } transition-colors`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3
                      className={`font-medium ${
                        theme === "light" ? "text-gray-900" : "text-white"
                      }`}
                    >
                      {snippet.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm ${
                          theme === "light" ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        {format(new Date(snippet.createdAt), "MMM d, yyyy")}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-md ${
                          theme === "light" ? "bg-green-200" : "bg-green-700"
                        }`}
                      >
                        {snippet.language}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 mt-4">
                    <button
                      onClick={() => handleDelete(snippet.id)}
                      className={`p-2 rounded-lg hover:bg-opacity-80 transition-colors ${
                        theme === "light"
                          ? "text-red-600 hover:bg-red-50"
                          : "text-red-400 hover:bg-red-900/20"
                      }`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        onLoadSnippet(snippet.code, snippet.language)
                      }
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        theme === "light"
                          ? "bg-blue-500 hover:bg-blue-600 text-white"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      Load Snippet
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnippetsModal;
