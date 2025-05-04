import { useEffect, useState } from 'react';
import { Editor, useMonaco } from '@monaco-editor/react';
import { loader } from '@monaco-editor/react';

// Configure Monaco Editor's CDN path
loader.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' } });

interface CodeEditorProps {
  language?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string | undefined) => void;
  onSelectionChange?: (event: any) => void;
  theme?: 'light' | 'dark';
  height?: string;
  width?: string;
}

const CodeEditor = ({
  language = 'javascript',
  defaultValue = '// Start coding here...',
  value,
  onChange,
  onSelectionChange,
  theme = 'dark',
  height = '600px',
  width = '100%'
}: CodeEditorProps) => {
  const monaco = useMonaco();
  const [editorTheme, setEditorTheme] = useState(theme === 'light' ? 'vs' : 'vs-dark');

  // Handle theme changes
  useEffect(() => {
    setEditorTheme(theme === 'light' ? 'vs' : 'vs-dark');
  }, [theme]);

  // Configure Monaco editor when it's ready
  useEffect(() => {
    if (monaco) {
      // You can add custom language configurations here if needed
      console.log('Monaco instance is ready');
    }
  }, [monaco]);

  const handleEditorDidMount = (editor: any) => {
    // Enable resize feature
    editor.updateOptions({
      automaticLayout: true,
      wordWrap: 'on',
      wrappingStrategy: 'advanced'
    });

    // Add selection change listener
    if (onSelectionChange) {
      editor.onDidChangeCursorSelection((e: any) => {
        onSelectionChange({ ...e, target: editor.getDomNode() });
      });
    }
  };

  return (
    <div 
      className={`relative rounded-lg overflow-hidden border ${
        theme === 'light' 
          ? 'border-gray-200 bg-white' 
          : 'border-gray-700 bg-gray-800'
      }`}
      style={{ resize: 'both', minHeight: '200px', minWidth: '300px' }}
    >
      <Editor
        key={language}
        height={height}
        width={width}
        language={language}
        value={value ?? defaultValue}
        theme={editorTheme}
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: true },
          formatOnPaste: true,
          formatOnType: true,
          tabSize: 4,
          insertSpaces: true,
          autoIndent: 'advanced',
          quickSuggestions: false,
          contextmenu: false,
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            useShadows: true,
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10
          },
          suggestOnTriggerCharacters: true,
          wordWrap: 'on',
        }}
        loading={<div className="p-4 text-gray-500">Loading editor...</div>}
      />
      <div className="absolute bottom-2 right-2 text-xs text-gray-500">
        {language.toUpperCase()}
      </div>
    </div>
  );
};

export default CodeEditor; 