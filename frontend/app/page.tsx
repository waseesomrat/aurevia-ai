"use client";

import { useEffect, useState } from "react";
import SplashScreen from "./components/SplashScreen";
import Image from "next/image";
import Link from "next/link";

export default function Home() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const timer = setTimeout(() => {
      setLoading(false);
    }, 3500);

    return () => clearTimeout(timer);

  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (

    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #111827, #020617)",
        color: "white",
      }}
    >

      {/* NAVBAR */}

      <nav
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "25px 70px",
  }}
>

  <Image
    src="/logo.png"
    alt="Aurevia"
    width={160}
    height={70}
  />

  <div
    style={{
      display: "flex",
      gap: "25px",
      alignItems: "center",
    }}
  >
    <Link href="/analyze">Analyze</Link>
    <Link href="/fit-score">Fit Score</Link>
    <Link href="/jobs">Jobs</Link>
    <Link href="/tracker">Tracker</Link>
    <Link href="/dashboard"> Dashboard</Link>
    <Link href="/calendar">Calendar</Link>
    <Link href="/todo">Goals</Link>
    <Link href="/chat">AI Assistant</Link>
    <Link href="/cover-letter">Cover Letter</Link>
    <Link href="/roadmap">Roadmap</Link>
  </div>

</nav>

      {/* HERO */}

      <section
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          paddingTop: "120px",
        }}
      >

        <h1
          style={{
            fontSize: "78px",
            fontWeight: "bold",
            maxWidth: "1100px",
            lineHeight: 1.1,
            background:
              "linear-gradient(to right, #e9d5ff, #c084fc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          AI-Powered Career Intelligence
        </h1>

        <p
          style={{
            marginTop: "30px",
            fontSize: "24px",
            color: "#cbd5e1",
            maxWidth: "900px",
            lineHeight: 1.8,
          }}
        >
          Upload your CV and let Aurevia AI
          deeply analyze your skills,
          profession, strengths, weaknesses,
          and future career opportunities.
        </p>

        <Link href="/analyze">

          <button
            style={{
              marginTop: "55px",
              padding: "22px 60px",
              borderRadius: "18px",
              border: "none",
              background:
                "linear-gradient(to right, #9333ea, #c084fc)",
              color: "white",
              fontSize: "24px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow:
                "0px 0px 40px rgba(168,85,247,0.4)",
            }}
          >
            Start Analysis
          </button>

        </Link>

      </section>


        <section
           style={{
           padding: "80px 60px",
           }}
          >
        <h2
          style={{
          textAlign: "center",
          fontSize: "42px",
          marginBottom: "40px",
          color: "#d8b4fe",
          }}
           >
      Features
       </h2>

      <div
        style={{
        display: "grid",
        gridTemplateColumns:
        "repeat(auto-fit,minmax(250px,1fr))",
        gap: "20px",
       }}
      >

        <FeatureCard
          icon="📄"
          title="CV Analysis"
        />

        <FeatureCard
          icon="🎯"
          title="Fit Score"
         />

        <FeatureCard
          icon="🤖"
          title="AI Assistant"
         />

        <FeatureCard
          icon="💼"
          title="Job Hunter"
         />

        <FeatureCard
          icon="📝"
          title="Cover Letter"
         />

        <FeatureCard
          icon="🗺️"
          title="Roadmap"
         />

        <FeatureCard
         icon="📊"
         title="Dashboard"
        />

        <FeatureCard
         icon="✅"
         title="Tracker"
        />

      </div>
     </section>


    </main>

  );
  
}

  function FeatureCard({
    icon,
    title,
}: {
  icon: string;
  title: string;
}) {
  return (
    <div
      style={{
        background: "#081225",
        border:
          "1px solid #9333ea",
        borderRadius: "20px",
        padding: "30px",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "50px",
        }}
      >
        {icon}
      </h1>

      <h3>
        {title}
      </h3>
    </div>
  );
}

