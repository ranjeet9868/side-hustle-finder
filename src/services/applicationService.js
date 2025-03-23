// src/services/applicationService.js
export async function getMyApplications(token) {
  const response = await fetch(
    "http://localhost:4000/applications/myapplications",
    {
      headers: { Authorization: "Bearer " + token },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch applications");
  }
  return response.json();
}
