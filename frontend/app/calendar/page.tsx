"use client";
import "./calendar.css";
import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
const API_URL =
  "https://aurevia-backend-production-41e5.up.railway.app";
export default function CalendarPage() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [events, setEvents] = useState<any[]>([]);

  const loadEvents = async () => {
    const session_id = sessionStorage.getItem("session_id");

    if (!session_id) return;

    const res = await fetch(
       `${API_URL}/calendar/list?session_id=${session_id}`,
    );
    const data = await res.json();

    if (data.events) {
      setEvents(data.events);
    }
  };

  const addEvent = async () => {
    const session_id = sessionStorage.getItem("session_id");

    if (!session_id) {
      alert("Upload CV first");
      return;
    }

      await fetch(`${API_URL}/calendar/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id,
        title,
        date,
        description: "",
        event_type: "goal",
      }),
    });

    setTitle("");
    setDate("");

    await loadEvents();
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <div
  style={{
    minHeight: "100vh",
    background: "#020617",
    color: "white",
    padding: "40px",
  }}>
     <h1
  style={{
    color: "#d8b4fe",
    fontSize: "60px",
    marginBottom: "20px",
  }}
>
  Career Calendar
</h1>

      <div className="flex gap-2 mb-4">
       <input
  placeholder="Event Title"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  style={{
    background: "#081225",
    color: "white",
    border: "1px solid #9333ea",
    padding: "12px",
    borderRadius: "10px",
  }}
/>

     <input
  type="date"
  value={date}
  onChange={(e) => setDate(e.target.value)}
  style={{
    background: "#081225",
    color: "white",
    border: "1px solid #9333ea",
    padding: "12px",
    borderRadius: "10px",
  }}
/>
       <button
  onClick={addEvent}
  style={{
    background:
      "linear-gradient(to right,#9333ea,#c084fc)",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    cursor: "pointer",
  }}
>
  Add
</button>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events.map((event) => ({
          title: event.title,
          date: event.date,
        }))}
      />
    </div>
  );
}
