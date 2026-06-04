"use client";

import { useState } from "react";

export default function FitScorePage() {

  const [skills, setSkills] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);

  const calculateFitScore = async () => {

    try {

      const response = await fetch(
        "https://aurevia-backend-r18t.onrender.com/fit-score",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            skills: skills
              .split(",")
              .map((s) => s.trim()),
            job_description: jobDescription,
          }),
        }
      );

      const data = await response.json();

      setResult(data);

    } catch (error) {

      console.log(error);

      alert("Failed to calculate fit score");
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
        Job Fit Score
      </h1>

      <textarea
        placeholder="Enter skills separated by commas..."
        value={skills}
        onChange={(e) =>
          setSkills(e.target.value)
        }
        style={{
          width: "100%",
          height: "120px",
          marginBottom: "20px",
          padding: "20px",
          borderRadius: "15px",
        }}
      />

      <textarea
        placeholder="Paste Job Description..."
        value={jobDescription}
        onChange={(e) =>
          setJobDescription(e.target.value)
        }
        style={{
          width: "100%",
          height: "220px",
          marginBottom: "20px",
          padding: "20px",
          borderRadius: "15px",
        }}
      />

      <button
        onClick={calculateFitScore}
        style={{
          background: "#9333ea",
          color: "white",
          border: "none",
          padding: "18px 35px",
          borderRadius: "15px",
          cursor: "pointer",
          fontSize: "18px",
        }}
      >
        Calculate Fit Score
      </button>

      {result && (
        <div
          style={{
            marginTop: "40px",
            background: "#081225",
            padding: "30px",
            borderRadius: "20px",
          }}
        >
          <h2>
            Fit Score: {result.fit_score}%
          </h2>

          <h3>
            Matching Skills
          </h3>

          <ul>
            {result.matching_skills?.map(
              (skill, index) => (
                <li key={index}>
                  {skill}
                </li>
              )
            )}
          </ul>

          <h3>
            Missing Skills
          </h3>

          <ul>
            {result.missing_skills?.map(
              (skill, index) => (
                <li key={index}>
                  {skill}
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
}