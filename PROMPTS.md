# AI Coding Assistant Log (PROMPTS.md)

**Project:** Real-Time Collaborative Document Editor (CollabDocs)
**Tools Used:** ChatGPT (GPT-4o), GitHub Copilot
**Date:** January 2026

## Session 1: Architecture & Project Setup

**Prompt:**
> "I have a technical assignment to build a Google Docs clone in 24 hours. The stack must be MERN (MongoDB, Express, React, Node) with Socket.io. Functional requirements: No auth (anonymous), real-time rich text sync, and a chat sidebar. Can you generate the folder structure and the initial `server/index.js` setup to handle basic Socket.io connections and MongoDB connection?"

**Result:**
The AI provided a dual-folder structure (`client` and `server`). It generated the Express server boilerplate listening on port 3001, configured CORS to allow the frontend (localhost:5173), and set up the basic Mongoose connection string.

**Follow-up Prompt:**
> "I need a Mongoose schema to store the document. It needs an `_id` (which will be the Room ID) and a `data` field to store the rich text content. Also, create a separate Schema for the Chat messages associated with a room."

**Result:**
The AI created `Schema.js` with two models: `Document` (using `_id` as the room identifier to easily `findById`) and `Chat` (storing an array of message objects with timestamps).

## Session 2: The Editor (Quill + React)

**Prompt:**
> "I want to use `quill` and `react-quill` (or just native Quill wrapper) for the editor. The document needs to sync across clients. Can you write a `TextEditor` component? IMPORTANT: I need to handle the socket `text-change` events. When a user types, emit `send-changes`. When a user receives `receive-changes`, update the local Quill instance."

**Result:**
The AI suggested using a `useCallback` ref to initialize Quill effectively in React 19. It wrote the logic to listen for Quill's `text-change` event, filter for `source === 'user'`, and emit the delta. It also set up the `socket.on("receive-changes")` listener to call `quill.updateContents`.

**Refinement Prompt:**
> "The editor needs to look like a document page, not full width. Center it on a gray background, give it a white paper look with shadow, and ensure the toolbar sticks to the top."

**Result:**
The AI provided the CSS-in-JS (styled-jsx approach) to override Quill's default styles, adding a `max-width: 800px`, `box-shadow`, and `position: sticky` for the toolbar to mimic a real document interface.

## Session 3: Chat Sidebar & Real-time Logic

**Prompt:**
> "Create a `ChatSidebar` component. It should slide in from the right or sit next to the editor. It needs to load chat history from MongoDB when a user joins and listen for `receive-message` for live updates. Use Tailwind CSS for styling."

**Result:**
The AI generated a responsive Sidebar component. It included the `useEffect` hook to emit `join-chat` on mount and listeners for `load-chat` and `receive-message`. It also implemented a collapsible UI state for better UX on smaller screens.

**Prompt:**
> "On the server side, how do I handle the specific Room logic? I need `socket.join(roomId)` so messages only go to people in that specific doc."

**Result:**
The AI updated the backend `io.on("connection")` logic to handle rooms. It added specific event handlers: `socket.on("join-chat")` joins the socket room, and `io.to(roomId).emit` ensures messages are broadcast only to relevant users.

## Session 4: Landing Page & Polish

**Prompt:**
> "I need a Landing Page (`Home.js`) where a user can either generate a new random UUID and redirect to `/documents/:uuid` or paste an existing ID to join. Make it look modern using a dark theme with Tailwind gradients."

**Result:**
The AI provided the `Home` component using `uuid` for ID generation and `react-router-dom`'s `useNavigate` for redirection. It styled the page with `bg-gradient-to-br`, glass-morphism effects on the card, and a clear "Create New Room" workflow.

**Prompt:**
> "Final check: How do I handle the 'save' logic? I don't want to save to MongoDB on every keystroke."

**Result:**
The AI suggested a debouncing strategy or a simple interval. We implemented a `setInterval` in the `TextEditor` component that emits `save-document` every 2 seconds if changes exist, ensuring database efficiency without losing data.