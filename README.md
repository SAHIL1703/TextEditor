# CollabDocs - Real-Time Collaborative Editor

A lightweight, real-time rich text editor (Google Docs clone) allowing anonymous users to collaborate on documents and chat instantly. Built with the **MERN Stack** and **Socket.io**.



[Image of WebSocket architecture diagram]


## 🚀 Features

* **Real-Time Collaboration:** Multiple users can edit the same document simultaneously. Changes sync instantly via WebSockets.
* **Rich Text Editing:** powered by **Quill.js** (Bold, Italic, Lists, Fonts, Alignment, etc.).
* **Live Chat:** Integrated sidebar chat for users in the same room.
* **Room Persistence:** Documents and chat history are saved to MongoDB.
* **No Authentication:** Instant access via unique Room IDs (UUIDs).
* **Responsive UI:** Built with Tailwind CSS v4.

## 🛠 Tech Stack

### Frontend (Client)
* **Framework:** React 19 (Vite 7)
* **Styling:** Tailwind CSS v4
* **Editor Engine:** Quill.js
* **Routing:** React Router DOM v7
* **Real-time:** Socket.io-client

### Backend (Server)
* **Runtime:** Node.js
* **Framework:** Express v5
* **Database:** MongoDB + Mongoose v9
* **Real-time:** Socket.io

---

## ⚙️ Installation & Setup

### 1. Prerequisites
* Node.js (v18+ recommended)
* MongoDB installed locally (running on port `27017`) OR a MongoDB Atlas URI.

### 2. Backend Setup (Server)

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Environment Setup:**
    Create a `.env` file in the `server` folder (optional if using local Mongo):
    ```env
    MONGO_URI=mongodb://localhost:27017/collabDocs
    PORT=3001
    ```
4.  Start the Server:
    ```bash
    npx nodemon index.js
    ```
    *Output should confirm: `MongoDB Connected` and `Server running on 3001`.*

### 3. Frontend Setup (Client)

1.  Open a new terminal and navigate to the client directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the React app:
    ```bash
    npm run dev
    ```
4.  Open the link shown (usually `http://localhost:5173`).

---

## 📖 Usage Guide

1.  **Create a Room:** Click "Create New Room" on the landing page. You will be redirected to a unique URL (e.g., `/documents/b8a9-...`).
2.  **Share:** Copy the Room ID or the URL and send it to a friend.
3.  **Collaborate:**
    * Type in the editor; your friend sees the text appear character-by-character.
    * Open the **Chat Sidebar** (bottom right icon) to send messages.
4.  **Save:** The document saves automatically to the database every 2 seconds.

## 📂 Project Structure

```text
/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # ChatSidebar, TextEditor
│   │   ├── Home.jsx        # Landing Page
│   │   ├── App.jsx         # Routing
│   │   └── main.jsx
│   └── package.json
│
├── server/                 # Node/Express Backend
│   ├── Schema.js           # Mongoose Models (Document, Chat)
│   ├── index.js            # Server entry, Socket logic, DB connection
│   └── package.json