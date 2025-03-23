// src/services/chatService.js

// Fetch messages for a specific job chat
export async function getChatMessages(token, jobId) {
  const res = await fetch(`http://localhost:4000/chat/${jobId}`, {
    headers: { Authorization: "Bearer " + token },
  });
  // You can add error handling here if needed
  return res.json();
}

// Fetch active chats for the logged-in user
export async function getActiveChats(token) {
  const res = await fetch("http://localhost:4000/active-chats", {
    headers: { Authorization: "Bearer " + token },
  });
  return res.json();
}
