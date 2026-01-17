const mongoose = require("mongoose");

// Document Schema
const DocumentSchema = new mongoose.Schema({
  _id: String, // We will use the Document ID as the Room ID
  data: Object, // Stores the Quill Delta object (rich text state)
});

// Chat Schema
const ChatSchema = new mongoose.Schema({
  roomId: String,
  messages: [
    {
      user: String,
      text: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

module.exports = {
  Document: mongoose.model("Document", DocumentSchema),
  Chat: mongoose.model("Chat", ChatSchema),
};