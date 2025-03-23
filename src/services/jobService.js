// src/services/jobService.js
export async function getMyJobsWithResponses(token) {
  const response = await fetch("http://localhost:4000/jobs/myjobs/responses", {
    headers: { Authorization: "Bearer " + token },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch posted jobs with responses");
  }
  return response.json();
}

export async function getJob(jobId, token) {
  const res = await fetch(`http://localhost:4000/jobs/${jobId}`, {
    headers: { Authorization: "Bearer " + token },
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to fetch job");
  }
  return res.json();
}

export async function updateJob(jobId, jobData, token) {
  const res = await fetch(`http://localhost:4000/jobs/${jobId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(jobData),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to update job");
  }
  return res.json();
}

export async function getAllJobs(token) {
  const response = await fetch("http://localhost:4000/jobs", {
    headers: { Authorization: "Bearer " + token },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch jobs");
  }
  return response.json();
}
