"use client";

import { useEffect, useState } from "react";


export default function ChatPage() {
  const [question, setQuestion] = useState("");
  const [summary, setSummary] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

   const [cvData, setCvData] = useState(null);

  useEffect(() => {
  const saved =
    localStorage.getItem("cvData");

  if (saved) {
    setCvData(JSON.parse(saved));
  }
}, []);

   useEffect(() => {
  const saved = localStorage.getItem("cvData");

  if (saved) {
    const cv = JSON.parse(saved);

    setSummary(`
Name: ${cv.name}

Profession: ${cv.profession}

Skills:
${(cv.skills || []).join(", ")}

Summary:
${cv.summary}
`);
  }
}, []);

  const askAI = async () => {
    if (!question) {
      alert("Please enter a question");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://aurevia-backend-r18t.onrender.com/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question,
            summary,
          }),
        }
      );

      const data = await response.json();

      setAnswer(data.answer);
    } catch (error) {
      console.log(error);
      alert("AI Assistant Failed");
    }

    setLoading(false);
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
        AI Career Assistant
      </h1>

      <p
        style={{
          color: "#94a3b8",
          marginBottom: "30px",
          fontSize: "20px",
        }}
      >
        Ask anything about your career, skills,
        roadmap, CV improvement, jobs, or future goals.
      </p>

     <textarea
        value={summary}
        readOnly
        style={{
          width: "100%",
          height: "180px",
          padding: "20px",
          borderRadius: "15px",
          marginBottom: "20px",
          fontSize: "16px",
        }}
      />

      <textarea
        placeholder="Ask your question..."
        value={question}
        onChange={(e) =>
          setQuestion(e.target.value)
        }
        style={{
          width: "100%",
          height: "120px",
          padding: "20px",
          borderRadius: "15px",
          marginBottom: "20px",
          fontSize: "16px",
        }}
      />

      <button
        onClick={askAI}
        disabled={loading}
        style={{
          background:
            "linear-gradient(to right,#9333ea,#c084fc)",
          color: "white",
          border: "none",
          padding: "18px 35px",
          borderRadius: "15px",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      {answer && (
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
            AI Response
          </h2>

          <p
            style={{
              whiteSpace: "pre-wrap",
              lineHeight: "32px",
              fontSize: "18px",
            }}
          >
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}