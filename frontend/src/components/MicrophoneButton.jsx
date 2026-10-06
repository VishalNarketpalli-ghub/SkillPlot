import { useState } from 'react';

export function MicrophoneButton({ onRecord }) {
  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (onRecord) onRecord(!isRecording);
  };

  return (
    <button
      onClick={toggleRecording}
      className={`p-4 rounded-full transition-all duration-300 ${
        isRecording ? 'bg-red-500 animate-pulse text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
      title="Toggle Microphone"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    </button>
  );
}
