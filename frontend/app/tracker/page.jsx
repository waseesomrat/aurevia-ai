"use client";

import { useEffect, useState } from "react";

export default function TrackerPage() {

  const [job, setJob] = useState("");
  const [status, setStatus] =
    useState("Applied");

  const [applied, setApplied] =
    useState([]);

  const [interviewing,
    setInterviewing] =
    useState([]);

  const [offer,
    setOffer] =
    useState([]);

  const [rejected,
    setRejected] =
    useState([]);


  // LOAD DATA

  const [cvData, setCvData] = useState(null);

  useEffect(() => {
  const saved =
    sessionStorage.getItem("cvData");

  if (saved) {
    setCvData(JSON.parse(saved));
  }
}, []);

  useEffect(() => {

    const savedApplied =
      localStorage.getItem(
        "applied"
      );

    const savedInterviewing =
      localStorage.getItem(
        "interviewing"
      );

    const savedOffer =
      localStorage.getItem(
        "offer"
      );

    const savedRejected =
      localStorage.getItem(
        "rejected"
      );

    if (savedApplied)
      setApplied(
        JSON.parse(savedApplied)
      );

    if (savedInterviewing)
      setInterviewing(
        JSON.parse(
          savedInterviewing
        )
      );

    if (savedOffer)
      setOffer(
        JSON.parse(savedOffer)
      );

    if (savedRejected)
      setRejected(
        JSON.parse(savedRejected)
      );

  }, []);

  // SAVE DATA

  useEffect(() => {

    localStorage.setItem(
      "applied",
      JSON.stringify(applied)
    );

  }, [applied]);

  useEffect(() => {

    localStorage.setItem(
      "interviewing",
      JSON.stringify(
        interviewing
      )
    );

  }, [interviewing]);

  useEffect(() => {

    localStorage.setItem(
      "offer",
      JSON.stringify(offer)
    );

  }, [offer]);

  useEffect(() => {

    localStorage.setItem(
      "rejected",
      JSON.stringify(rejected)
    );

  }, [rejected]);

  const addJob = () => {

        console.log("CLICKED");
        console.log(job);
        console.log(status);

    if (!job.trim()) return;
    

    if (status === "Applied") {

      setApplied([
        ...applied,
        job
      ]);

    } else if (
      status ===
      "Interviewing"
    ) {

      setInterviewing([
        ...interviewing,
        job
      ]);

    } else if (
      status === "Offer"
    ) {

      setOffer([
        ...offer,
        job
      ]);

    } else {

      setRejected([
        ...rejected,
        job
      ]);

    }

    setJob("");
  };

  const deleteItem = (column, index) => {

  if (column === "Applied") {
    setApplied(
      applied.filter(
        (_, i) => i !== index
      )
    );
  }

  if (column === "Interviewing") {
    setInterviewing(
      interviewing.filter(
        (_, i) => i !== index
      )
    );
  }

  if (column === "Offer") {
    setOffer(
      offer.filter(
        (_, i) => i !== index
      )
    );
  }

  if (column === "Rejected") {
    setRejected(
      rejected.filter(
        (_, i) => i !== index
      )
    );
  }

};

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        padding: "40px",
      }}
    >

      <h1
        style={{
          color: "#d8b4fe",
          fontSize: "60px",
          marginBottom: "20px",
        }}
      >
        Application Tracker
      </h1>

      <input
        value={job}
        onChange={(e) =>
          setJob(e.target.value)
        }
        placeholder="Google SWE Internship"
        style={{
          padding: "15px",
          width: "350px",
          borderRadius: "10px",
          marginRight: "10px",
        }}
      />

      <select
        value={status}
        onChange={(e) =>
          setStatus(e.target.value)
        }
        style={{
          padding: "15px",
          borderRadius: "10px",
          marginRight: "10px",
        }}
      >
        <option>
          Applied
        </option>

        <option>
          Interviewing
        </option>

        <option>
          Offer
        </option>

        <option>
          Rejected
        </option>

      </select>

      <button
        onClick={addJob}
        style={{
          background: "#9333ea",
          color: "white",
          border: "none",
          padding: "15px 25px",
          borderRadius: "10px",
        }}
      >
        Add Application
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4,1fr)",
          gap: "20px",
          marginTop: "40px",
        }}
      >

        <Column
        title="Applied"
        items={applied}
        onDelete={(index) =>
        deleteItem("Applied",index) }
       />

        <Column
        title="Interviewing"
        items={interviewing}
        onDelete={(index) =>
        deleteItem("Interviewing",index)}
        />

        <Column
        title="Offer"
        items={offer}
        onDelete={(index) =>
        deleteItem("Offer", index)}
        />

        <Column
        title="Rejected"
        items={rejected}
        onDelete={(index) =>
        deleteItem("Rejected",index )}
        />

      </div>

    </div>
  );
}

function Column({
  title,
  items,
  onDelete,
}) {

  return (

    <div
      style={{
        background: "#081225",
        padding: "20px",
        borderRadius: "15px",
      }}
    >

      <h2
        style={{
          color: "#d8b4fe",
        }}
      >
        {title}
      </h2>

      {items.map(
        (item, index) => (

          <div
            key={index}
            style={{
              background:
                "#111827",
              padding: "12px",
              marginTop: "10px",
              borderRadius:
                "10px",
            }}
          >
            <div
            style={{
            display: "flex",
            justifyContent:
           "space-between",
           alignItems: "center",
            }}
           >
    <span>{item}</span>

         <button
         onClick={() =>
         onDelete(index)
        }
            style={{
            background: "#ef4444",
             color: "white",
            border: "none",
            padding: "5px 10px",
           borderRadius: "6px",
           cursor: "pointer",
          }}
         >
         Delete
  </button>
</div>

          </div>

        )
      )}

    </div>
  );
}