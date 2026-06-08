"use client";

import { useEffect, useState,} from "react";

export default function DashboardPage() {

  const [appliedCount, setAppliedCount] =
  useState(0);

const [interviewCount, setInterviewCount] =
  useState(0);

const [offerCount, setOfferCount] =
  useState(0);

const [rejectedCount, setRejectedCount] =
  useState(0);

 const [applications, setApplications] =
  useState(0);

const [goals, setGoals] =
  useState(0);

const [cvScore, setCvScore] = useState(0);
const [atsScore, setAtsScore] = useState(0);
const [cvData, setCvData] = useState(null);



const [roadmapProgress, setRoadmapProgress] =
  useState(0);

 
   useEffect(() => {

    const saved = localStorage.getItem("cvData");

    if (saved) {
    const data = JSON.parse(saved);

    setCvData(data);

      setCvScore(data.cv_score || 0);
      setAtsScore(data.ats_score || 0);
    }

  const applied =
    JSON.parse(
      localStorage.getItem(
        "applied"
      ) || "[]"
    );

  const interviewing =
    JSON.parse(
      localStorage.getItem(
        "interviewing"
      ) || "[]"
    );

  const offer =
    JSON.parse(
      localStorage.getItem(
        "offer"
      ) || "[]"
    );

  const rejected =
    JSON.parse(
      localStorage.getItem(
        "rejected"
      ) || "[]"
    );

  const totalApplications =
    applied.length +
    interviewing.length +
    offer.length +
    rejected.length;
    setAppliedCount(applied.length);

    setInterviewCount(
      interviewing.length
    );

    setOfferCount(
      offer.length
    );

    setRejectedCount(
      rejected.length
    );

    setApplications(
      totalApplications
    );

  const todo =
    JSON.parse(
      localStorage.getItem(
        "todo"
      ) || "[]"
    );


    setGoals(todo.length);
    let progress = 0;

    if (cvData) progress += 20;
    if (todo.length > 0) progress += 20;
    if (totalApplications > 0) progress += 20;
    if (interviewing.length > 0) progress += 20;
    if (offer.length > 0) progress += 20;

    setRoadmapProgress(progress);

}, []);


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
          marginBottom: "40px",
        }}
      >
        Career Dashboard
      </h1>

        {cvData && (
    <div
      style={{
        background: "#081225",
        border: "1px solid #9333ea",
        borderRadius: "20px",
        padding: "25px",
        marginBottom: "30px",
      }}
    >
      <h2>{cvData.name}</h2>

      <p>
        Profession: {cvData.profession}
      </p>

      <p>
        Skills:
        {cvData.skills?.join(", ")}
      </p>
    </div>
  )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: "25px",
        }}
      >

      <Card
        title="CV Score"
        value={`${cvScore}%`}
      />

      <Card
       title="ATS Score"
       value={`${atsScore}%`}
      />

     <Card
     title="Goals Created"
     value={goals}
     />

     <Card
     title="Applied"
     value={appliedCount}
     />

    <Card
     title="Interviewing"
     value={interviewCount}
     />

     <Card
     title="Offers"
     value={offerCount}
     />
     <Card
      title="Applications"
      value={applications}
    />

     <Card
     title="Rejected"
     value={rejectedCount}
    />

      </div>

      <div
        style={{
          marginTop: "50px",
          background: "#081225",
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
          Roadmap Progress
        </h2>

        <div
          style={{
            width: "100%",
            height: "18px",
            background: "#1e293b",
            borderRadius: "999px",
          }}
        >
          <div
            style={{
              width: `${roadmapProgress}%`,
              height: "100%",
              background:
                "linear-gradient(to right,#9333ea,#c084fc)",
              borderRadius: "999px",
            }}
          />
        </div>

        <p
          style={{
            marginTop: "15px",
            fontSize: "18px",
          }}
        >
          {roadmapProgress}% Complete
        </p>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div
      style={{
        background: "#081225",
        border: "1px solid #9333ea",
        borderRadius: "20px",
        padding: "30px",
      }}
    >
      <h3
        style={{
          color: "#c084fc",
          marginBottom: "15px",
        }}
      >
        {title}
      </h3>

      <h1
        style={{
          fontSize: "42px",
        }}
      >
        {value}
      </h1>
    </div>
  );
}