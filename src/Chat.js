// src/Chat.js
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useSearchParams } from "react-router-dom";

// Connect to your backend Socket.IO server
const socket = io("http://localhost:4000");

export default function Chat({ token }) {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId"); // job id passed in the URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Load existing messages on mount
  useEffect(() => {
    fetch(`http://localhost:4000/chat/${jobId}`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => {
        // Assuming data is an array of message objects
        // Map them to just the message text or keep the full object as needed
        setMessages(data.map((msg) => msg.message));
      })
      .catch(console.error);
  }, [jobId, token]);

  useEffect(() => {
    // When component mounts, join the room for this job
    socket.emit("joinRoom", jobId);

    socket.on("joinSuccess", (msg) => {
      console.log("Join success:", msg);
    });

    socket.on("joinError", (error) => {
      console.error("Join error:", error);
    });

    // Listen for incoming chat messages
    socket.on("chatMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Clean up listeners when unmounting
    return () => {
      socket.off("joinRoom");
      socket.off("joinSuccess");
      socket.off("joinError");
      socket.off("chatMessage");
    };
  }, [jobId]);

  const sendMessage = () => {
    if (newMessage.trim() === "") return;
    // Optionally, you can include a sender field if you have that info
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
