import { useRef, useEffect } from 'react';

export function ChatLog({ history }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);
  return (
    <div className="flex flex-col gap-4 p-4 max-h-[500px] overflow-y-auto">
      {history.map((msg, index) => (
        <div key={index} className={`flex ${msg.role === 'interviewer' ? 'justify-start' : 'justify-end'}`}>
          <div className={`max-w-[70%] p-4 rounded-lg ${msg.role === 'interviewer' ? 'bg-blue-50 text-blue-900 rounded-bl-none' : 'bg-gray-800 text-white rounded-br-none'}`}>
            <div className="text-xs font-semibold mb-1 opacity-70 uppercase tracking-wider">
              {msg.role}
            </div>
            <div className="whitespace-pre-wrap">{msg.content}</div>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
