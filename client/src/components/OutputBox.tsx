import React from 'react';

interface OutputBoxProps {
  output: string;
  error?: string;
  isLoading?: boolean;
  theme?: 'light' | 'dark';
}

const OutputBox = ({ output, error, isLoading, theme = 'dark' }: OutputBoxProps) => {
  return (
    <div className="relative h-full">
      <div className="flex justify-between items-center mb-2">
        <div className={`text-sm font-medium ${
          theme === 'light' ? 'text-gray-600' : 'text-gray-300'
        }`}>
          Output
        </div>
      </div>
      <div
        className={`h-[calc(100%-2rem)] overflow-auto rounded-lg p-4 font-mono text-sm ${
          theme === 'light'
            ? 'bg-gray-100 text-gray-800'
            : 'bg-gray-800 text-gray-200'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className={`animate-spin rounded-full h-6 w-6 border-2 ${
              theme === 'light'
                ? 'border-gray-900 border-t-transparent'
                : 'border-white border-t-transparent'
            }`} />
          </div>
        ) : error ? (
          <pre className="text-red-500 whitespace-pre-wrap font-mono text-sm">{error}</pre>
        ) : output ? (
          <pre className={`whitespace-pre-wrap font-mono text-sm ${
            theme === 'light' ? 'text-gray-800' : 'text-gray-200'
          }`}>{output}</pre>
        ) : (
          <div className={`text-center h-full flex items-center justify-center ${
            theme === 'light' ? 'text-gray-500' : 'text-gray-400'
          }`}>
            Run your code to see the output here
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputBox; 