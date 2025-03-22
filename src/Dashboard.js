// src/Dashboard.js
import React, { useState } from "react";
import { Container, Tabs, Tab, Box } from "@mui/material";
import JobList from "./JobList";
import JobPosting from "./JobPosting";

export default function Dashboard({ token }) {
  const [tab, setTab] = useState(0);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Tabs
        value={tab}
        onChange={handleChange}
        centered
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label="Job Listings" />
        <Tab label="Post a Job" />
      </Tabs>
      <Box sx={{ mt: 3 }}>
        {tab === 0 && <JobList token={token} />}
        {tab === 1 && <JobPosting token={token} />}
      </Box>
    </Container>
  );
}
