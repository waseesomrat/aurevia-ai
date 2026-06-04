"use client";

import { useState } from "react";

export default function JobsPage() {

  const [query, setQuery] = useState("");
  const [jobs, setJobs] = useState([]);

  const searchJobs = async () => {

    try {

      const response = await fetch(
        "https://aurevia-backend-r18t.onrender.com/job-search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query,
          }),
        }
      );

      const data = await response.json();

      setJobs(data.jobs);

    } catch (error) {

      console.log(error);

      alert("Job search failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        padding: "50px",
      }}
    >
      <h1
        style={{
          color: "#d8b4fe",
          fontSize: "60px",
          marginBottom: "20px",
        }}
      >
        Job Hunter Agent
      </h1>

      <input
        type="text"
        placeholder="Find ML internships in Dhaka"
        value={query}
        onChange={(e) =>
          setQuery(e.target.value)
        }
        style={{
          width: "100%",
          padding: "18px",
          borderRadius: "15px",
          marginBottom: "20px",
        }}
      />

      <button
        onClick={searchJobs}
        style={{
          background:
            "linear-gradient(to right,#9333ea,#c084fc)",
          color: "white",
          border: "none",
          padding: "18px 35px",
          borderRadius: "15px",
          cursor: "pointer",
        }}
      >
        Search Jobs
      </button>

      <div
        style={{
          marginTop: "40px",
          display: "grid",
          gap: "20px",
        }}
      >
        {jobs.map((job, index) => (
          <div
            key={index}
            style={{
              background: "#081225",
              border:
                "1px solid #9333ea",
              borderRadius: "20px",
              padding: "25px",
            }}
          >
            <h2>{job.role}</h2>

            <p>
              Company: {job.company}
            </p>

            <p>
              Location: {job.location}
            </p>

            <p>
              Salary: {job.salary}
            </p>

            <p>
              Deadline: {job.deadline}
            </p>

            <p>
              Fit Score:
              {job.fit_score}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}