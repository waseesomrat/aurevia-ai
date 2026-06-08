# Aurevia AI – Career Intelligence Platform

## Overview

Aurevia AI is an AI-powered career co-pilot that helps users analyze their CVs, discover career opportunities, evaluate job fit, generate cover letters, build learning roadmaps, and track job applications.

The platform combines AI analysis, career planning, and productivity tools into a single experience.

---

## Features

### CV Analysis

* Upload PDF CV
* AI-powered profession detection
* Skills extraction
* Strength analysis
* Weakness analysis
* Career recommendations
* CV Score
* ATS Score

### Job Hunter Agent

* Search jobs
* View role, company, location, salary, deadline
* Fit score for each opportunity

### Fit Score Engine

* Compare CV skills against job descriptions
* Identify matching skills
* Identify missing skills
* Generate percentage fit score

### AI Career Assistant

* Career guidance
* Skill recommendations
* Job readiness evaluation
* Personalized responses

### Cover Letter Generator

* Generate tailored cover letters
* Uses candidate profile and job description

### Career Roadmap Generator

* Creates learning roadmap
* Weekly and monthly career planning

### Productivity Tools

* Goals & To-Do Manager
* Application Tracker
* Career Dashboard

---

## Tech Stack

### Frontend

* Next.js
* React

### Backend

* FastAPI
* Python

### AI

* Groq API
* Llama Models

### Deployment

* Vercel
* Render

---

## Project Architecture

User

↓

Next.js Frontend

↓

FastAPI Backend

↓

Groq AI

↓

Career Analysis & Recommendations

---

## Installation

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## Environment Variables

Create a `.env` file:

```env
GROQ_API_KEY=your_api_key_here
```

---

## Live Demo

Frontend:
https://aurevia-frontend-64rno3rye-intezar-mahmud-wasi-s-projects.vercel.app

Backend:
https://aurevia-backend-production-41e5.up.railway.app

---

## Future Improvements

* Real Job APIs
* Vector Database
* RAG Pipeline
* Interview Preparation Module
* Calendar Integration
* Advanced Analytics Dashboard

---

## Team

Built for Codesprint – CareerPilot Challenge.
