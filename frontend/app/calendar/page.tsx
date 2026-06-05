"use client";

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

export default function CalendarPage() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [events, setEvents] = useState<any[]>([]);

  const loadEvents = async () => {
    const session_id = localStorage.getItem("session_id");

    if (!session_id) return;

    const res = await fetch(
      `http://localhost:8000/calendar/list?session_id=${session_id}`,
    );

    const data = await res.json();

    if (data.events) {
      setEvents(data.events);
    }
  };

  const addEvent = async () => {
    const session_id = localStorage.getItem("session_id");

    if (!session_id) {
      alert("Upload CV first");
      return;
    }

    await fetch("http://localhost:8000/calendar/add", {
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
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Calendar</h1>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="border p-2"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button className="bg-blue-500 text-white px-4" onClick={addEvent}>
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
