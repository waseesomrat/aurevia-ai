  "use client";
  import ReactMarkdown from "react-markdown";
  import { useEffect, useState } from "react";

  export default function RoadmapPage() {
    const [profession, setProfession] = useState("");
    const [roadmap, setRoadmap] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      const saved = localStorage.getItem("cvData");

      if (saved) {
        const cv = JSON.parse(saved);
        setProfession(cv.profession || "");
      }
    }, []);

    const generateRoadmap = async () => {
      if (!profession) {
        alert("Enter a profession");
        return;
      }

      setLoading(true);

      try {
        const session_id =
          localStorage.getItem("session_id");

        const API_URL =
          "https://aurevia-backend-production-41e5.up.railway.app";

        const response = await fetch(
          `${API_URL}/roadmap`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              session_id,
            }),
          }
        );

        const data = await response.json();

        setRoadmap(data.roadmap);
              localStorage.setItem(
        "roadmap",
        data.roadmap
      );

      localStorage.setItem(
        "roadmap_generated",
        "true"
      );
      } catch (error) {
        console.log(error);
        alert("Failed to generate roadmap");
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
          Career Roadmap Generator
        </h1>

        <input
          type="text"
          placeholder="Software Engineer"
          value={profession}
          onChange={(e) =>
            setProfession(e.target.value)
          }
          style={{
            width: "100%",
            padding: "18px",
            borderRadius: "15px",
            marginBottom: "20px",
          }}
        />

        <button
          onClick={generateRoadmap}
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
            : "Generate Roadmap"}
        </button>

        {roadmap && (
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
              Your Roadmap
            </h2>

            <div
        
    style={{
      lineHeight: "32px",
      color: "white",
      fontSize: "18px",
    }}
  >
    <ReactMarkdown
      components={{
        h1: ({ children }) => (
          <h1
            style={{
              color: "#d8b4fe",
              marginBottom: "15px",
            }}
          >
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2
            style={{
              color: "#c084fc",
              marginTop: "20px",
              marginBottom: "10px",
            }}
          >
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3
            style={{
              color: "#e9d5ff",
              marginTop: "15px",
            }}
          >
            {children}
          </h3>
        ),
        li: ({ children }) => (
          <li style={{ marginBottom: "8px" }}>
            {children}
          </li>
        ),
      }}
    >
      {roadmap}
    </ReactMarkdown>
  </div>
          </div>
        )}
      </div>
    );
  }