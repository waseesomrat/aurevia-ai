"use client";

import { useState } from "react";

export default function CoverLetterPage() {
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);

  const generateCoverLetter = async () => {
    if (!name || !profession || !jobDescription) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://aurevia-backend-r18t.onrender.com/cover-letter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            profession,
            job_description: jobDescription,
          }),
        }
      );

      const data = await response.json();

      setCoverLetter(data.cover_letter);
    } catch (error) {
      console.log(error);
      alert("Failed to generate cover letter");
    }

    setLoading(false);
  };

  const copyLetter = () => {
    navigator.clipboard.writeText(coverLetter);
    alert("Cover Letter Copied!");
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
        Cover Letter Generator
      </h1>

      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          width: "100%",
          padding: "18px",
          marginBottom: "20px",
          borderRadius: "12px",
        }}
      />

      <input
        type="text"
        placeholder="Profession"
        value={profession}
        onChange={(e) => setProfession(e.target.value)}
        style={{
          width: "100%",
          padding: "18px",
          marginBottom: "20px",
          borderRadius: "12px",
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
          padding: "20px",
          borderRadius: "15px",
          marginBottom: "20px",
        }}
      />

      <button
        onClick={generateCoverLetter}
        disabled={loading}
        style={{
          background:
            "linear-gradient(to right,#9333ea,#c084fc)",
          color: "white",
          border: "none",
          padding: "18px 35px",
          borderRadius: "15px",
          cursor: "pointer",
          fontSize: "18px",
        }}
      >
        {loading
          ? "Generating..."
          : "Generate Cover Letter"}
      </button>

      {coverLetter && (
        <div
          style={{
            marginTop: "40px",
            background: "#081225",
            border: "1px solid #9333ea",
            borderRadius: "20px",
            padding: "30px",
          }}
        >
          <h2
            style={{
              color: "#d8b4fe",
              marginBottom: "20px",
            }}
          >
            Generated Cover Letter
          </h2>

          <p
            style={{
              whiteSpace: "pre-wrap",
              lineHeight: "32px",
            }}
          >
            {coverLetter}
          </p>

          <button
            onClick={copyLetter}
            style={{
              marginTop: "20px",
              background: "#9333ea",
              color: "white",
              border: "none",
              padding: "14px 25px",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            Copy Letter
          </button>
        </div>
      )}
    </div>
  );
}