// src/services/userService.js
export async function getCurrentUser(token) {
  const response = await fetch("http://localhost:4000/user", {
    headers: { Authorization: "Bearer " + token },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch user");
  }
  return response.json();
}
