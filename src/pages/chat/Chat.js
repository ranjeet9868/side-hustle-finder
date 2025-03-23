// src/pages/chat/Chat.js
import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useSearchParams } from "react-router-dom";
import { getChatMessages } from "../../services/chatService";

const socket = io("http://localhost:4000");

export default function Chat({ token }) {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [newMessage, setNewMessage] = useState("");

  // Fetch initial chat messages from the service
  useEffect(() => {
    getChatMessages(token, jobId)
      .then((data) => setMessages(data.map((msg) => msg.message)))
      .catch(console.error);
  }, [token, jobId]);

  // Socket logic remains the same
  useEffect(() => {
    socket.emit("joinRoom", jobId);

    socket.on("joinSuccess", (msg) => console.log("Join success:", msg));
    socket.on("joinError", (error) => console.error("Join error:", error));
    socket.on("chatMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("joinRoom");
      socket.off("joinSuccess");
      socket.off("joinError");
      socket.off("chatMessage");
    };
  }, [jobId]);

  // Auto-scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Send message
  const sendMessage = () => {
    if (newMessage.trim() === "") return;
    socket.emit("chatMessage", { jobId, message: newMessage });
    setNewMessage("");
  };

  return (
    <div style={{ margin: "20px" }}>
      <h2>Chat for Job {jobId}</h2>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "300px",
          overflowY: "scroll",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <input
        type="text"
        value={newMessage}
        placeholder="Type your message..."
        onChange={(e) => setNewMessage(e.target.value)}
        style={{ width: "70%", padding: "8px" }}
      />
      <button
        onClick={sendMessage}
        style={{ padding: "8px 16px", marginLeft: "10px" }}
      >
        Send
      </button>
    </div>
  );
}
