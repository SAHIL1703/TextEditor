const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const cors = require("cors");
const { Document, Chat } = require("./Schema"); // Ensure Schema.js exists in the same folder
require("dotenv").config();

const app = express();
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/collabDocs")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Allow requests from React Client
    methods: ["GET", "POST"],
  },
});

const defaultValue = "";

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // === 1. DOCUMENT LOGIC ===
  socket.on("get-document", async (documentId) => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit("load-document", document.data);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(documentId, { data });
    });
  });

  // === 2. CHAT LOGIC ===
  socket.on("join-chat", async (roomId) => {
    console.log(`User ${socket.id} joining chat room: ${roomId}`);
    
    // CRITICAL: Actually join the socket room
    socket.join(roomId);

    // Load history
    const chatHistory = await Chat.findOne({ roomId });
    socket.emit("load-chat", chatHistory ? chatHistory.messages : []);
  });

  socket.on("send-message", async ({ roomId, message, user }) => {
    console.log(`Message in room ${roomId}: ${message}`);
    
    const newMessage = { user, text: message, timestamp: new Date() };

    // Save to Database
    await Chat.findOneAndUpdate(
      { roomId },
      { $push: { messages: newMessage } },
      { upsert: true, new: true }
    );

    // Broadcast to everyone in the room (LIVE UPDATE)
    io.to(roomId).emit("receive-message", newMessage);
  });
});

async function findOrCreateDocument(id) {
  if (id == null) return;
  const document = await Document.findById(id);
  if (document) return document;
  return await Document.create({ _id: id, data: defaultValue });
}

server.listen(3001, () => {
  console.log("Server running on 3001");
});