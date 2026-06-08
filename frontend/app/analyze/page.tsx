"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
const API_URL =
  "https://aurevia-backend-production-41e5.up.railway.app";
export default function AnalyzePage() {
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("");
  useEffect(() => {
  const saved = sessionStorage.getItem("cvData");

  if (saved) {
    setResult(JSON.parse(saved));
  }
}, []);
  const handleUpload = async () => {
  if (!file) {
    alert("Please upload a CV PDF");
    return;
  }

  setLoading(true);
  setProgress(0);
  setStage("📄 Uploading CV...");

  const formData = new FormData();
  formData.append("file", file);

  let currentProgress = 0;

  const interval = setInterval(() => {
    currentProgress += 10;

    if (currentProgress <= 20) {
      setStage("📄 Uploading CV...");
    } else if (currentProgress <= 40) {
      setStage("🧠 Extracting Resume Data...");
    } else if (currentProgress <= 60) {
      setStage("🎯 Analyzing Skills...");
    } else if (currentProgress <= 80) {
      setStage("📊 Calculating ATS Score...");
    } else {
      setStage("🚀 Generating Career Insights...");
    }

    if (currentProgress < 90) {
      setProgress(currentProgress);
    }
  }, 700);

  try {
   const response = await fetch(
  `${API_URL}/analyze`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    clearInterval(interval);
  if (data.session_id) {
  sessionStorage.setItem(
    "session_id",
    data.session_id
  );
}

setResult(data);

sessionStorage.setItem(
  "cvData",
  JSON.stringify(data)
);

    setTimeout(() => {
      setLoading(false);
      setProgress(0);
      setStage("");
    }, 1000);

  } catch (error) {
    clearInterval(interval);

    console.log(error);

    alert("AI Analysis Failed");

    setLoading(false);
    setProgress(0);
    setStage("");
  }
};
  
  const downloadPDF = async () => {
  try {
      const response = await fetch(
  `${API_URL}/generate-report`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result),
      }
    );

    const blob = await response.blob();

    const url =
      window.URL.createObjectURL(blob);

    const a =
      document.createElement("a");
    a.href = url;
a.download = "Aurevia_Report.pdf";

document.body.appendChild(a);
a.click();
document.body.removeChild(a);

window.URL.revokeObjectURL(url);

  } catch (error) {
    console.log(error);
  }
};

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <h1
        style={{
          fontSize: "70px",
          color: "#d8b4fe",
          marginBottom: "20px",
        }}
      >
        Aurevia AI
      </h1>

      <p
        style={{
          fontSize: "22px",
          color: "#94a3b8",
          marginBottom: "50px",
          maxWidth: "900px",
          lineHeight: "40px",
        }}
      >
        Upload your CV and let Aurevia AI analyze your
        profession, skills, strengths, weaknesses,
        and career opportunities.
      </p>

      <div
        style={{
          background: "#081225",
          border: "1px solid #6b21a8",
          borderRadius: "30px",
          padding: "40px",
          marginBottom: "40px",
        }}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setFile(e.target.files[0]);
            }
          }}
        />

        <br />
        <br />

        <button
          onClick={handleUpload}
          disabled={loading}
          style={{
            background: "#9333ea",
            color: "white",
            border: "none",
            padding: "18px 40px",
            borderRadius: "18px",
            fontSize: "26px",
            cursor: "pointer",
          }}
        >
          
          {loading ? "Analyzing..." : "Analyze CV"}
        </button>
        
      </div>
      {loading && (
  <div
    style={{
      marginTop: "25px",
      width: "100%",
      maxWidth: "700px",
    }}
  >
    <div
      style={{
        width: "100%",
        height: "22px",
        background: "#1e293b",
        borderRadius: "999px",
        overflow: "hidden",
        border: "1px solid #6b21a8",
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: "100%",
          background:
            "linear-gradient(90deg,#9333ea,#c084fc)",
          transition: "width 0.5s ease",
        }}
      />
    </div>

    <p
      style={{
        marginTop: "12px",
        color: "#d8b4fe",
        fontSize: "20px",
        fontWeight: "bold",
      }}
    >
      {stage}
    </p>

    <p
      style={{
        color: "#94a3b8",
        fontSize: "18px",
      }}
    >
      Progress: {progress}%
    </p>
  </div>
)}    
     {result && (
  <>

     <button
       onClick={downloadPDF}
       style={{
        background: "#9333ea",
        color: "white",
        border: "none",
        padding: "16px 30px",
        borderRadius: "15px",
        fontSize: "18px",
        cursor: "pointer",
        marginBottom: "30px",
  }}
>
  📄 Download Report
</button>

    {/* Candidate */}

    <div
      style={{
        background: "#081225",
        border: "1px solid #9333ea",
        borderRadius: "30px",
        padding: "30px",
        marginBottom: "25px",
      }}
    >
      <h2
        style={{
          color: "#d8b4fe",
          fontSize: "28px",
          marginBottom: "10px",
        }}
      >
        👤 Candidate
      </h2>

      <p
        style={{
          fontSize: "34px",
          fontWeight: "bold",
          color: "white",
        }}
      >
        {result.name || "Unknown"}
      </p>
    </div>

    {/* Profession */}

    <div
      style={{
        background: "#081225",
        border: "1px solid #9333ea",
        borderRadius: "30px",
        padding: "40px",
        marginBottom: "30px",
      }}
    >
      <h2
        style={{
          color: "#d8b4fe",
          fontSize: "42px",
          marginBottom: "15px",
        }}
      >
        🎯 Recommended Profession
      </h2>

      <p
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          color: "white",
        }}
      >
        {result.profession || "Unknown"}
      </p>
    </div>

    {/* Scores */}

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "30px",
        marginBottom: "30px",
      }}
    >

      <Card
        title="CV Score"
        content={result.cv_score || "N/A"}
      />

      <Card
        title="ATS Score"
        content={result.ats_score || "N/A"}
      />
    </div>

    {/* Main Cards */}

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "30px",
      }}
    >
      <Card
        title="AI Summary"
        content={result.summary}
      />

      <Card
        title="Career Matches"
        content={result.career_matches?.join(", ")}
      />

      <Card
        title="Strengths"
        content={result.strengths?.join(", ")}
      />

      <Card
        title="Weaknesses"
        content={result.weaknesses?.join(", ")}
      />

      <Card
        title="Improvement Suggestions"
        content={result.improvements?.join(", ")}
      />

      <div
        style={{
          background: "#081225",
          border: "1px solid #6b21a8",
          borderRadius: "30px",
          padding: "35px",
        }}
      >
        <h2
          style={{
            color: "#d8b4fe",
            fontSize: "30px",
            marginBottom: "25px",
          }}
        >
          Skills
        </h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          {result.skills?.map((skill: string, index: number) => (
            <span
              key={index}
              style={{
                background: "#9333ea",
                padding: "10px 18px",
                borderRadius: "999px",
                fontWeight: "bold",
              }}
            >
              {skill}
            </span>
          ))}
        </div>
           </div>
      </div>   {/* Skills card end */}

        <div
        style={{
          marginTop: "50px",
          padding: "30px",
          background: "#081225",
          borderRadius: "25px",
          border: "1px solid #9333ea",
        }}
      >
      <h2
      style={{
    color: "#d8b4fe",
    textAlign: "center",
    marginBottom: "25px",
  }}
  > 
  🚀 Explore More Features
      </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
          }}
        >
          <FeatureButton
            title="🤖 AI Assistant"
            link="/chat"
          />

          <FeatureButton
            title="💼 Jobs"
            link="/jobs"
          />

          <FeatureButton
            title="🗺 Roadmap"
            link="/roadmap"
          />

          <FeatureButton
            title="📈 Dashboard"
            link="/dashboard"
          />

          <FeatureButton
            title="📋 Tracker"
            link="/tracker"
          />
        </div>
      </div>
  </>
)}
    </div>
  );
}


function Card({
  title,
  content,
}: {
  title: string;
  content: any;
}) {
  return (
    <div
      style={{
        background: "#081225",
        border: "1px solid #6b21a8",
        borderRadius: "30px",
        padding: "35px",
        minHeight: "220px",
      }}
    >
      <h2
        style={{
          color: "#d8b4fe",
          fontSize: "30px",
          marginBottom: "25px",
        }}
      >
        {title}
      </h2>

      <p
        style={{
          color: "white",
          fontSize: "20px",
          lineHeight: "36px",
          whiteSpace: "pre-wrap",
        }}
      >
        {content || "No data"}
      </p>
    </div>
  );
}

      

   function FeatureButton(props: any) {
  const { title, link } = props;

  return (
    <Link
      href={link}
      style={{
        textDecoration: "none",
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(135deg,#9333ea,#c084fc)",
          color: "white",
          padding: "25px",
          borderRadius: "20px",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "20px",
          cursor: "pointer",
        }}
      >
        {title}
      </div>
    </Link>
  );
}