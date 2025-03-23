// src/services/authService.js

export async function login(email, password) {
  const response = await fetch("http://localhost:4000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
}

export async function register(email, password) {
  const response = await fetch("http://localhost:4000/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
}

// Add the logout helper here:
export function logout(setToken, navigate) {
  localStorage.removeItem("token");
  setToken(null);
  navigate("/login");
}
