import React, { useEffect, useState } from "react";

export default function ChatSidebar({ socket, roomId }) {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!socket || !roomId) return;

    socket.emit("join-chat", roomId);

    socket.on("load-chat", (history) => {
      setMessages(history);
    });

    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("load-chat");
      socket.off("receive-message");
    };
  }, [socket, roomId]);

  const sendMessage = () => {
    if (currentMessage.trim() !== "") {
      const msgData = {
        roomId,
        message: currentMessage,
        user: "User " + Math.floor(Math.random() * 100),
      };
      socket.emit("send-message", msgData);
      setCurrentMessage("");
    }
  };

  // CLOSED STATE: Still floating (Fixed position)
  if (!isOpen) {
    return (
      <button 
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl z-50 transition-all duration-300 transform hover:scale-110 flex items-center justify-center group"
        onClick={() => setIsOpen(true)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>
    );
  }

  // OPEN STATE: Docked (Flex item)
  // KEY FIX: Removed 'fixed right-0'. Added 'w-80 h-full flex-none'.
  return (
    <div className="w-80 h-full bg-white border-l border-gray-200 shadow-xl flex flex-col flex-none z-40">
      
      {/* Header */}
      <div className="px-5 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center flex-none">
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <h3 className="font-semibold text-gray-700">Room Chat</h3>
        </div>
        <button 
            onClick={() => setIsOpen(false)} 
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1 rounded transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
             <p className="text-sm">No messages yet</p>
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-gray-400 mb-1 ml-1">{msg.user}</span>
            <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none text-sm text-gray-800 shadow-sm border border-gray-100 w-fit max-w-[90%]">
              <p className="leading-relaxed">{msg.message || msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100 flex-none">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button 
            onClick={sendMessage}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-md"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 translate-x-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
             </svg>
          </button>
        </div>
      </div>
    </div>
  );
}