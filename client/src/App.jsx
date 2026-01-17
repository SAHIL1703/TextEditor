import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import TextEditor from "./TextEditor";
import ChatSidebar from "./ChatSidebar";
import Home from "./Home"; 

function EditorPage() {
  const { id: roomId } = useParams();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = io("http://localhost:3001");
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      alert("Room ID copied to clipboard!");
    } catch (err) {
      alert("Could not copy ID");
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-50">
      
      {/* Navbar */}
      <nav className="h-16 flex-none bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 shadow-sm z-20 relative">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/'}>
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-blue-500/20 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </div>
            <h1 className="font-bold text-gray-800 text-lg hidden sm:block tracking-tight">
                Collab<span className="text-blue-600">Docs</span>
            </h1>
          </div>
          <div className="h-6 w-px bg-gray-300 mx-2 hidden sm:block"></div>
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Room:</span>
            <span className="text-xs font-mono font-medium text-gray-700 truncate max-w-[100px] sm:max-w-none">
                {roomId}
            </span>
          </div>
        </div>

        <button 
          onClick={copyRoomId}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow active:scale-95"
        >
          <span className="hidden sm:inline">Copy ID</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
        </button>
      </nav>

      {/* Main Layout Area */}
      {/* KEY FIX: 'flex-row' puts the editor and sidebar side-by-side */}
      <div className="flex-1 flex flex-row overflow-hidden w-full relative">
        
        {/* Editor Container - takes remaining width */}
        <div className="flex-1 h-full w-full relative">
           <TextEditor />
        </div>

        {/* Chat Sidebar - takes fixed width when open */}
        {socket && <ChatSidebar socket={socket} roomId={roomId} />}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/documents/:id" element={<EditorPage />} />
      </Routes>
    </Router>
  );
}

export default App;