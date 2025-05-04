interface RunButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled?: boolean;
  theme: 'light' | 'dark';
}

const RunButton = ({ onClick, isLoading, disabled, theme }: RunButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`
        flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold
        shadow-lg transform transition-all duration-200
        hover:scale-105 active:scale-95
        ${isLoading || disabled
          ? theme === 'light'
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          : theme === 'light'
            ? 'bg-green-500 hover:bg-green-600 text-white'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }
      `}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
          <span>Running...</span>
        </>
      ) : (
        <>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Run Code</span>
        </>
      )}
    </button>
  );
};

export default RunButton; 