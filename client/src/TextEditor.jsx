import { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

export default function TextEditor() {
  const { id: documentId } = useParams();
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();

  useEffect(() => {
    const s = io("http://localhost:3001");
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });
    q.disable();
    q.setText("Loading...");
    setQuill(q);
  }, []);

  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
    });

    socket.emit("get-document", documentId);

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };
    quill.on("text-change", handler);

    const receiveHandler = (delta) => {
      quill.updateContents(delta);
    };
    socket.on("receive-changes", receiveHandler);

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, 2000);

    return () => {
      quill.off("text-change", handler);
      socket.off("receive-changes", receiveHandler);
      clearInterval(interval);
    };
  }, [socket, quill, documentId]);

  return (
    // KEY FIX: 'h-full' ensures this container fits into the flex-1 space of App.js
    <div className="bg-gray-100 h-full flex flex-col items-center py-8 overflow-y-auto">
      <style>{`
        .ql-toolbar {
            position: sticky;
            top: 0;
            z-index: 10;
            background: white;
            border: none !important;
            border-bottom: 1px solid #e5e7eb !important;
            border-radius: 8px 8px 0 0;
            padding: 12px !important;
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .ql-container.ql-snow {
            border: none !important;
            background-color: white;
            width: 100%;
            max-width: 800px;
            min-height: 11in;
            margin: 1rem auto;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            padding: 2rem; 
        }
        @media print, screen and (max-width: 800px) {
            .ql-toolbar, .ql-container.ql-snow {
                max-width: 100%;
                width: 100%;
                margin: 0;
                box-shadow: none;
            }
        }
      `}</style>
      
      <div className="w-full px-4" ref={wrapperRef}></div>
    </div>
  );
}