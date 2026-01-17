import { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    // Optional: Toast notification here
    alert("Created new room ID: " + id);
  };

  const joinRoom = () => {
    if (!roomId) {
      alert("Please enter a Room ID");
      return;
    }
    // Navigate to the editor page with the ID
    navigate(`/documents/${roomId}`);
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white selection:bg-blue-500 selection:text-white">
      {/* Card Container */}
      <div className="w-full max-w-md p-8 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 ring-1 ring-white/10">
        
        {/* Header Section */}
        <div className="mb-8 text-center">
          {/* Added a Logo Icon for branding presence */}
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-7 w-7 text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            Collab<span className="text-blue-500">Docs</span>
          </h1>
          <p className="text-gray-400 text-sm font-medium">
            Real-time collaboration made easy
          </p>
        </div>

        {/* Form Section */}
        <div className="space-y-6">
          <div>
            <label 
              htmlFor="room-id" 
              className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2"
            >
              Room ID
            </label>
            <div className="relative group">
              {/* Input Icon */}
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <input
                id="room-id"
                type="text"
                className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-600 text-sm"
                placeholder="Paste UUID or create new"
                onChange={(e) => setRoomId(e.target.value)}
                value={roomId}
                onKeyUp={handleInputEnter}
                autoComplete="off"
              />
            </div>
          </div>

          <button
            onClick={joinRoom}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-lg shadow-lg shadow-blue-500/30 transform transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 text-sm"
          >
            Join Room
          </button>

          <div className="pt-2 text-center">
            <p className="text-sm text-gray-400">
              Don't have an invite?{" "}
              <a
                onClick={createNewRoom}
                href="#"
                className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors decoration-blue-400/30 underline-offset-4"
              >
                Create New Room
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}