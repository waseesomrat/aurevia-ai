"use client";

import { useEffect, useState } from "react";

export default function UploadPage() {

  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const [profession, setProfession] = useState("");
const [summary, setSummary] = useState("");

const [skills, setSkills] = useState<string[]>([]);
const [strengths, setStrengths] = useState<string[]>([]);
const [weaknesses, setWeaknesses] = useState<string[]>([]);
const [careerMatches, setCareerMatches] = useState<string[]>([]);
const [improvements, setImprovements] = useState<string[]>([]);

const [cvScore, setCvScore] = useState(0);
const [atsScore, setAtsScore] = useState(0);


  async function uploadCV() {

    if (!file) {
      alert("Please select a PDF CV");
      return;
    }

    setLoading(true);

    const formData = new FormData();

    formData.append("file", file);

    try {

      const response = await fetch(
  "https://aurevia-backend-r18t.onrender.com/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      alert(JSON.stringify(data));

      localStorage.setItem("cvData",JSON.stringify(data));

      setProfession(data.profession || "");
      setSummary(data.summary || "");
      setSkills(data.skills || []);
      setStrengths(data.strengths || []);
      setWeaknesses(data.weaknesses || []);
      setCareerMatches(data.career_matches || []);
      setImprovements(data.improvements || []);
      setCvScore(data.cv_score || 0);
      setAtsScore(data.ats_score || 0);
    }  
    catch (error) {

      console.log(error);

      alert("AI analysis failed");

    }

    setLoading(false);
  }
    
     useEffect(() => {
      const saved =sessionStorage.getItem("cvData");

        if (saved) {
      const data = JSON.parse(saved);

    setProfession(data.profession || "");
    setSummary(data.summary || "");
    setSkills(data.skills || []);
    setStrengths(data.strengths || []);
    setWeaknesses(data.weaknesses || []);
    setCareerMatches(data.career_matches || []);
    setImprovements(data.improvements || []);
    setCvScore(data.cv_score || 0);
    setAtsScore(data.ats_score || 0);
  }
}, []);




  return (

    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #111827, #020617)",
        color: "white",
        fontFamily: "Arial",
        padding: "60px 40px",
      }}
    >

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "50px",
        }}
      >

        <img
          src="/logo.png"
          alt="logo"
          style={{
            width: "80px",
          }}
        />

        <div>

          <h1
            style={{
              margin: 0,
              fontSize: "42px",
            }}
          >
            Aurevia
          </h1>

          <p
            style={{
              margin: 0,
              color: "#94a3b8",
            }}
          >
            AI CAREER INTELLIGENCE
          </p>

        </div>

      </div>

      {/* UPLOAD BOX */}
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          background: "#111827",
          borderRadius: "30px",
          padding: "60px",
          border: "1px solid #1e293b",
          textAlign: "center",
          marginBottom: "60px",
        }}
      >

        <h1
          style={{
            fontSize: "56px",
            marginBottom: "20px",
          }}
        >
          Upload Your Resume
        </h1>

        <p
          style={{
            color: "#94a3b8",
            fontSize: "20px",
            marginBottom: "40px",
            lineHeight: "1.8",
          }}
        >
          Aurevia AI will analyze your resume and
          provide personalized career intelligence.
        </p>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => {

            if (e.target.files) {
              setFile(e.target.files[0]);
            }

          }}
          style={{
            color: "white",
            marginBottom: "30px",
            fontSize: "18px",
          }}
        />

        <br />

        <button
          onClick={uploadCV}
          style={{
            background:
              "linear-gradient(to right, #7c3aed, #2563eb)",
            border: "none",
            padding: "18px 40px",
            borderRadius: "18px",
            color: "white",
            fontSize: "20px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {loading
            ? "Analyzing..."
            : "Analyze Resume"}
        </button>

      </div>

      {/* RESULTS */}
      {(profession || strengths.length > 0) && (

        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >

          {/* Profession */}
          <div
            style={{
              background: "#111827",
              border: "1px solid #1e293b",
              borderRadius: "24px",
              padding: "30px",
              marginBottom: "30px",
            }}
          >

            <h2
              style={{
                color: "#a855f7",
                marginBottom: "14px",
              }}
            >
              👤 Current Profession / Status
            </h2>

            <p
              style={{
                fontSize: "28px",
              }}
            >
              {profession}
            </p>

          </div>
          {/* SUMMARY */}
<div
  style={{
    background: "#111827",
    border: "1px solid #1e293b",
    borderRadius: "24px",
    padding: "30px",
    marginBottom: "30px",
  }}
>
  <h2
    style={{
      color: "#3b82f6",
      marginBottom: "14px",
    }}
  >
    📄 AI Summary
  </h2>

  <p
    style={{
      lineHeight: "1.8",
      color: "#e2e8f0",
    }}
  >
    {summary}
  </p>
</div>   
       
       <div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
    marginBottom: "30px",
  }}
>

  <div
    style={{
      background: "#111827",
      borderRadius: "24px",
      padding: "30px",
      border: "1px solid #22c55e",
      textAlign: "center",
    }}
  >
    <h2>CV Score</h2>
    <h1>{cvScore}/100</h1>
  </div>

  <div
    style={{
      background: "#111827",
      borderRadius: "24px",
      padding: "30px",
      border: "1px solid #3b82f6",
      textAlign: "center",
    }}
  >
    <h2>ATS Score</h2>
    <h1>{atsScore}/100</h1>
  </div>

</div>

          {/* GRID */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
            }}
          >

            <ResultCard
              title="Strengths"
              color="#22c55e"
              items={strengths}
            />

            <ResultCard
              title="Career Suggestions"
              color="#f59e0b"
            items={careerMatches}
            />

            <ResultCard
              title="Areas To Improve"
              color="#ef4444"
              items={weaknesses}
            />

            <ResultCard
              title="AI Recommendations"
              color="#3b82f6"
              items={improvements}
            />

          </div>

        </div>

      )}

    </main>

  );
}

/* RESULT CARD */
function ResultCard({
  title,
  color,
  items,
}: {
  title: string;
  color: string;
  items: string[];
}) {

  return (

    <div
      style={{
        background: "#111827",
        border: `1px solid ${color}`,
        borderRadius: "24px",
        padding: "30px",
      }}
    >

      <h3
        style={{
          color,
          fontSize: "28px",
          marginBottom: "20px",
        }}
      >
        {title}
      </h3>

      <ul
        style={{
          lineHeight: "2",
          color: "#e2e8f0",
          paddingLeft: "20px",
        }}
      >

        {items.map((item, index) => (

          <li key={index}>
            {item}
          </li>

        ))}

      </ul>

    </div>

  );
}