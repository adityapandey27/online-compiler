import React, { useState, useEffect } from 'react';
import { templates, CodeTemplate } from '../data/templates';

interface TemplateLibraryProps {
  theme: 'light' | 'dark';
  currentLanguage: string;
  onSelectTemplate: (code: string) => void;
  onClose: () => void;
}

const TemplateLibrary: React.FC<TemplateLibraryProps> = ({
  theme,
  currentLanguage,
  onSelectTemplate,
  onClose
}) => {
  const [filteredTemplates, setFilteredTemplates] = useState<CodeTemplate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Get unique categories
  const categories = ['All', ...new Set(templates.map(template => template.category))];
  
  // Filter templates based on language, search term, and category
  useEffect(() => {
    let filtered = templates.filter(template => template.language === currentLanguage);
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(template => 
        template.title.toLowerCase().includes(term) || 
        template.description.toLowerCase().includes(term) ||
        template.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    setFilteredTemplates(filtered);
  }, [currentLanguage, searchTerm, selectedCategory]);
  
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50`}>
      <div className={`rounded-lg p-4 sm:p-6 w-full max-w-4xl max-h-[80vh] flex flex-col shadow-xl ${
        theme === 'light' ? 'bg-white' : 'bg-gray-800'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-lg sm:text-xl font-semibold ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            Code Templates
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              theme === 'light' 
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
            aria-label="Close template library"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border transition-colors duration-200 ${
                theme === 'light'
                  ? 'bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  : 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400'
              }`}
            />
          </div>
          <div className="w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`w-full sm:w-[150px] px-4 py-2 rounded-lg border transition-colors duration-200 ${
                theme === 'light'
                  ? 'bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  : 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400'
              }`}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredTemplates.length === 0 ? (
            <div className={`text-center py-8 ${
              theme === 'light' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              No templates found. Try changing your search or filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
              {filteredTemplates.map(template => (
                <div
                  key={template.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                    theme === 'light'
                      ? 'border-gray-200 hover:border-blue-300 hover:shadow-lg bg-white'
                      : 'border-gray-700 hover:border-blue-500 hover:shadow-lg bg-gray-800'
                  }`}
                  onClick={() => onSelectTemplate(template.code)}
                >
                  <h3 className={`font-medium mb-2 ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    {template.title}
                  </h3>
                  <p className={`text-sm mb-3 ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                  }`}>
                    {template.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {template.tags.map(tag => (
                      <span
                        key={tag}
                        className={`text-xs px-2 py-1 rounded-full ${
                          theme === 'light'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateLibrary; 