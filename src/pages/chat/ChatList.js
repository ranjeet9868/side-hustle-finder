// src/pages/chat/ChatList.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getActiveChats } from "../../services/chatService";

export default function ChatList({ token }) {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getActiveChats(token)
      .then((data) => setChats(data))
      .catch((err) => console.error("Error fetching active chats:", err));
  }, [token]);

  const handleOpenChat = (jobId) => {
    navigate(`/dashboard/chat?jobId=${jobId}`);
  };

  return (
    <div style={{ margin: "20px" }}>
      <h2>Active Chats</h2>
      {chats.length === 0 ? (
        <p>No active chats found.</p>
      ) : (
        chats.map((job) => (
          <div
            key={job._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h4>{job.title}</h4>
            <p>{job.description}</p>
            <p>
              Category: {job.category} | Location: {job.city}, {job.province},{" "}
              {job.country}
            </p>
            <button onClick={() => handleOpenChat(job._id)}>Open Chat</button>
          </div>
        ))
      )}
    </div>
  );
}
