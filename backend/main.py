from urllib import response

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from groq import Groq
from PyPDF2 import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings


from fastapi.responses import FileResponse
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)
from reportlab.lib.styles import getSampleStyleSheet
import uuid

import tempfile
import traceback
import json
import os
import httpx

from pydantic import BaseModel
from typing import Optional
from threading import Lock

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings



load_dotenv()

RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()

client = Groq(api_key=GROQ_API_KEY)
user_sessions = {}
session_lock = Lock()

embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

vectorstore = None


class CalendarEventRequest(BaseModel):
    session_id: str
    title: str
    date: str
    description: Optional[str] = ""
    event_type: Optional[str] = "goal"


class DeleteCalendarEventRequest(BaseModel):
    session_id: str
    event_id: str

class TodoRequest(BaseModel):
    session_id: str
    title: str
    deadline: str
class TrackerRequest(BaseModel):
    session_id: str
    role: str
    company: str
    stage: str = "Applied"


class TrackerUpdateRequest(BaseModel):
    session_id: str
    application_id: str
    stage: str

@app.get("/")
def home():
    return {
        "status": "running",
        "groq_key_exists": len(GROQ_API_KEY) > 0
    }


@app.get("/rag-status")
def rag_status():

    global vectorstore

    return {
        "rag_ready": vectorstore is not None
    }


@app.get("/test-groq")
def test_groq():

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "user",
                    "content": "Say hello"
                }
            ]
        )

        return {
            "status": "success",
            "response": response.choices[0].message.content
        }

    except Exception as e:

        return {
            "status": "error",
            "error": str(e),
            "traceback": traceback.format_exc()
        }


@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):

    try:

        # Save uploaded PDF
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".pdf"
        ) as temp_file:

            content = await file.read()
            temp_file.write(content)
            temp_path = temp_file.name

        # Read PDF
        reader = PdfReader(temp_path)

        cv_text = ""

        for page in reader.pages:

            text = page.extract_text()

            if text:
                cv_text += text + "\n"


        global vectorstore

        splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=100
        )

        chunks = splitter.split_text(cv_text)

        vectorstore = FAISS.from_texts(
            chunks,
            embedding_model
        )

        if not cv_text.strip():

            return {
                "name": "Unknown",
                "profession": "Unknown",
                "summary": "No readable text found in CV.",
                "skills": [],
                "career_matches": [],
                "strengths": [],
                "weaknesses": [],
                "cv_score": 0,
                "ats_score": 0,
                "improvements": []
            }
        
        prompt = f"""
        You are an expert HR recruiter, ATS reviewer and career advisor.

        Analyze this CV.

        Return ONLY valid JSON.
        Rules:
        - Extract candidate full name.
        - Recommend the best profession.
        - Give at least 5 skills.
        - Give at least 3 strengths.
        - Give at least 3 weaknesses.
        - Give at least 5 career matches.
        - Give improvement suggestions.

        CV Score Rules:
        0-40 = Poor CV
        41-60 = Average CV
        61-75 = Good CV
        76-90 = Strong CV
        91-100 = Excellent CV

        Calculate CV score based on:
        - Education
        - Skills
        - Projects
        - Experience
        - Certifications
        - Achievements

        ATS Score Rules:
        Calculate based on:
        - Keywords
        - Formatting
        - Readability
        - Section organization
        - Contact information

        IMPORTANT:
        - Scores must depend on the actual CV.
        - Do NOT use fixed scores.
        - Different CVs should get different scores.

        Return ONLY valid JSON.

        JSON Format:

        {{
        "name": "",
        "profession": "",
        "summary": "",
        "skills": [],
        "career_matches": [],
        "strengths": [],
        "weaknesses": [],
        "cv_score": 0,
        "ats_score": 0,
        "improvements": []
        }}

CV:

{cv_text}
"""

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            temperature=0.2,
            response_format={"type": "json_object"},
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        ai_text = response.choices[0].message.content
        print("AI RESPONSE:")
        print(ai_text)
        try:
            data = json.loads(ai_text)
        except Exception as e:
             print("JSON ERROR:", e)
             data = {}

       
        
    # Fallback values

        if not data.get("name"):
            data["name"] = "Unknown"

        if not data.get("skills"):
                data["skills"] = [
                    "Communication",
                    "Problem Solving",
                    "Teamwork",
                    "Leadership",
                    "Time Management"
                ]

        if not data.get("strengths"):
                data["strengths"] = [
                    "Quick learner",
                    "Adaptable",
                    "Strong work ethic"
                ]

        if not data.get("weaknesses"):
                data["weaknesses"] = [
                    "Limited industry experience",
                    "Needs more projects",
                    "Can improve networking"
                ]

        if not data.get("career_matches"):
                data["career_matches"] = [
                    "Software Engineer",
                    "Data Analyst",
                    "Product Manager",
                    "Business Analyst",
                    "QA Engineer"
                ]

        if not data.get("improvements"):
                data["improvements"] = [
                    "Add more projects",
                    "Include measurable achievements",
                    "Improve CV formatting"
                ]

       # Dynamic CV Score

        cv_score = 40

        cv_score += min(len(data.get("skills", [])) * 3, 20)

        cv_score += min(len(data.get("strengths", [])) * 4, 12)

        cv_score += min(len(data.get("career_matches", [])) * 2, 10)

        text_lower = cv_text.lower()

        if "project" in text_lower:
            cv_score += 10

        if "experience" in text_lower:
            cv_score += 10

        if "certification" in text_lower:
            cv_score += 8

        if "achievement" in text_lower:
            cv_score += 10

        if "internship" in text_lower:
            cv_score += 8

        cv_score = min(cv_score, 100)

            # Dynamic ATS Score

        ats_score = 40

        if "email" in text_lower or "@" in cv_text:
            ats_score += 10

        if "phone" in text_lower:
            ats_score += 10

        if "education" in text_lower:
                ats_score += 10

        if "skills" in text_lower:
                ats_score += 10

        if "experience" in text_lower:
                ats_score += 10

        if "project" in text_lower:
                ats_score += 5

        if len(cv_text) > 1000:
                ats_score += 5

        ats_score = min(ats_score, 100)

        data["cv_score"] = cv_score
        data["ats_score"] = ats_score
       

        session_id = str(uuid.uuid4())

        with session_lock:
            user_sessions[session_id] = {
                "cv_text": cv_text,
                "extracted_data": data,
                "tracker": [],
                "todos": [],
                "calendar": []
            }

        data["session_id"] = session_id

        print("FINAL DATA:")
        print(data)
        return data

        
        

    except Exception as e:

        print(traceback.format_exc())

        return {
            "name": "Unknown",
            "profession": "Error",
            "summary": str(e),
            "skills": [],
            "career_matches": [],
            "strengths": [],
            "weaknesses": [],
            "cv_score": 0,
            "ats_score": 0,
            "improvements": []
        }
    
@app.post("/generate-report")
async def generate_report(data: dict):

        filename = f"report_{uuid.uuid4()}.pdf"

        doc = SimpleDocTemplate(filename)

        styles = getSampleStyleSheet()

        content = []

        content.append(
        Paragraph(
            "Aurevia AI Career Report",
            styles["Title"]
        )
    )

        content.append(Spacer(1, 20))

        content.append(
        Paragraph(
            f"<b>Candidate:</b> {data.get('name','Unknown')}",
            styles["Normal"]
        )
    )

        content.append(
        Paragraph(
            f"<b>Profession:</b> {data.get('profession','N/A')}",
            styles["Normal"]
        )
    )

        content.append(
        Paragraph(
            f"<b>CV Score:</b> {data.get('cv_score','N/A')}",
            styles["Normal"]
        )
    )

        content.append(
        Paragraph(
            f"<b>ATS Score:</b> {data.get('ats_score','N/A')}",
            styles["Normal"]
        )
    )

        content.append(Spacer(1, 15))

        content.append(
        Paragraph(
            f"<b>Summary:</b><br/>{data.get('summary','')}",
            styles["BodyText"]
        )
    )

        content.append(Spacer(1, 15))

        content.append(
        Paragraph(
            "<b>Skills</b>",
            styles["Heading2"]
        )
    )
 
        for skill in data.get("skills", []):
           content.append(
            Paragraph(
                f"• {skill}",
                styles["Normal"]
            )
        )

        content.append(Spacer(1, 15))

        content.append(
        Paragraph(
            "<b>Strengths</b>",
            styles["Heading2"]
        )
    )

        for item in data.get("strengths", []):
            content.append(
            Paragraph(
                f"• {item}",
                styles["Normal"]
            )
        )

        content.append(Spacer(1, 15))

        content.append(
        Paragraph(
            "<b>Weaknesses</b>",
            styles["Heading2"]
        )
    )

        for item in data.get("weaknesses", []):
            content.append(
            Paragraph(
                f"• {item}",
                styles["Normal"]
            )
        )
        doc.build(content)

        return FileResponse(
        filename,
        media_type="application/pdf",
        filename="Aurevia_Report.pdf"
    )

@app.post("/fit-score")
async def fit_score(data: dict):

    session_id = data.get("session_id")

    session = user_sessions.get(session_id)

    if not session:
        return {
            "fit_score": 0,
            "matching_skills": [],
            "missing_skills": []
        }

    cv_skills = session["extracted_data"].get(
        "skills",
        []
    )

    job_description = data.get(
        "job_description",
        ""
    ).lower()

    matched = []

    for skill in cv_skills:
        if skill.lower() in job_description:
            matched.append(skill)

    score = 0

    if len(cv_skills) > 0:
        score = int(
            (len(matched) / len(cv_skills)) * 100
        )

    missing = []

    common_skills = [
        "python",
        "sql",
        "excel",
        "react",
        "java",
        "communication",
        "leadership"
    ]

    for skill in common_skills:

        if (
            skill in job_description
            and skill.lower()
            not in [s.lower() for s in cv_skills]
        ):
            missing.append(skill)

    return {
        "fit_score": score,
        "matching_skills": matched,
        "missing_skills": missing
    }
    
@app.post("/roadmap")
async def roadmap(data: dict):

    session_id = data.get("session_id")

    session = user_sessions.get(session_id)

    if not session:
        return {
        "roadmap": "Invalid session"
    }

    cv = session["extracted_data"]

    profession = cv.get("profession", "")
    skills = cv.get("skills", [])
    summary = cv.get("summary", "")

    prompt = f"""
You are an expert career mentor.

Candidate Profession:
{profession}

Current Skills:
{", ".join(skills)}

Candidate Summary:
{summary}

Create a personalized 3 month roadmap.

Requirements:

- Week by week plan
- Skills to learn
- Projects to build
- Certifications to pursue
- Interview preparation
- Portfolio improvement
- Job application strategy

Format clearly:

Month 1
Week 1
Week 2
Week 3
Week 4

Month 2
Week 5
Week 6
Week 7
Week 8

Month 3
Week 9
Week 10
Week 11
Week 12

Return a detailed roadmap.
"""

    try:

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        return {
            "roadmap":
            response.choices[0].message.content
        }

    except Exception as e:

        print("ROADMAP ERROR:")
        print(e)

        return {
            "roadmap":
            f"""
Month 1
- Learn core {profession} concepts
- Practice fundamentals
- Build small projects

Month 2
- Build portfolio projects
- Learn advanced topics
- Improve problem solving

Month 3
- Prepare for interviews
- Apply for jobs
- Optimize CV and LinkedIn
"""
        }
@app.post("/cover-letter")
async def cover_letter(data: dict):

    session_id = data.get("session_id")

    session = user_sessions.get(session_id)

    if not session:
        return {
            "cover_letter": "Invalid session"
        }

    cv = session["extracted_data"]

    name = cv.get("name", "")
    profession = cv.get("profession", "")
    skills = cv.get("skills", [])
    summary = cv.get("summary", "")

    job_description = data.get(
        "job_description",
        ""
    )

    prompt = f"""
Write a professional cover letter.

Candidate Name:
{name}

Profession:
{profession}

Skills:
{", ".join(skills)}

Summary:
{summary}

Job Description:
{job_description}

Requirements:
- Professional tone
- Highlight relevant skills
- Mention candidate strengths
- Tailor to the job description
"""

    try:

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        return {
            "cover_letter":
            response.choices[0].message.content
        }

    except Exception as e:

        print("COVER LETTER ERROR:")
        print(e)

        return {
            "cover_letter":
            f"""
Dear Hiring Manager,

I am writing to express my interest in the {profession} position.

My background, skills, and experience make me a strong candidate for this role.

Thank you for your consideration.

Sincerely,
{name}
"""
        }

@app.post("/chat")
async def chat(data: dict):

    global vectorstore

    session_id = data.get("session_id")
    question = data.get("question", "")
    history = data.get("history", [])

    session = user_sessions.get(session_id)

    if not session:
        return {
            "answer": "Invalid session. Please upload CV again."
        }

    cv = session["extracted_data"]

    if vectorstore is None:
        return {
            "answer": "Please upload a CV first."
        }

    docs = vectorstore.similarity_search(
        question,
        k=3
    )

    context = "\n\n".join(
        [doc.page_content for doc in docs]
    )

    messages = [
        {
            "role": "system",
            "content": f"""
You are Aurevia AI Career Assistant.

Always use the candidate CV as the source of truth.

Candidate Name:
{cv.get('name', '')}

Profession:
{cv.get('profession', '')}

Skills:
{', '.join(cv.get('skills', []))}

Summary:
{cv.get('summary', '')}

Retrieved CV Context:
{context}

Give practical career guidance.
"""
        }
    ]

    messages.extend(history)

    messages.append(
        {
            "role": "user",
            "content": question
        }
    )

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=messages
    )

    return {
        "answer":
        response.choices[0].message.content
    }
    
@app.post("/job-search")
async def job_search(data: dict):

    print("API KEY:", os.getenv("RAPIDAPI_KEY"))

    query = data.get(
        "query",
        "Software Engineer"
    )

    country = data.get(
        "country",
        "Bangladesh"
    )

    session_id = data.get("session_id")

    session = user_sessions.get(session_id)

    if not session:
        return {
            "jobs": [],
            "message": "Invalid session"
        }

    cv = session["extracted_data"]

    skills = cv.get("skills", [])
    profession = cv.get("profession", "")
    
    print("CV =", cv)
    print("SKILLS =", skills)

    try:
        url = "https://jsearch.p.rapidapi.com/search"

        params = {
            "query": f"{query} in {country}",
            "page": "1",
            "num_pages": "1"
        }

        headers = {
            "X-RapidAPI-Key":
            os.getenv("RAPIDAPI_KEY"),
            "X-RapidAPI-Host":
            "jsearch.p.rapidapi.com"
        }

        async with httpx.AsyncClient() as client:

            response = await client.get(
                url,
                headers=headers,
                params=params
            )
            
            print("API KEY =", RAPIDAPI_KEY)

            print("STATUS =", response.status_code)

            print("RAW RESPONSE =")
            print(response.text)
                        

        result = response.json()

        jobs = []

        for item in result.get("data", [])[:10]:

            job_text = (
                item.get(
                    "job_description",
                    ""
                )
            ).lower()

            matched = []

            for skill in skills:
                
                job_text = (
                    item.get("job_title","")
                    + " "
                    + item.get("job_description","")
                ).lower()
                if skill.lower() in job_text:
                    matched.append(skill)

            fit_score = 0

            if len(skills) > 0:

                fit_score = int(
                    (
                        len(matched)
                        /
                        len(skills)
                    ) * 100
                )

            jobs.append(
                {
                    "role":
                    item.get(
                        "job_title",
                        "N/A"
                    ),

                    "company":
                    item.get(
                        "employer_name",
                        "N/A"
                    ),

                    "location":
                    item.get(
                        "job_city",
                        ""
                    ),

                    "salary":
                    item.get(
                        "job_salary",
                        "Not specified"
                    ),

                    "apply_link":
                    item.get(
                        "job_apply_link",
                        ""
                    ),

                    "fit_score":
                    fit_score,

                    "matching_skills":
                    matched
                }
            )

        return {
            "jobs": jobs
        }
        
    except Exception as e:

        import traceback

        print("========== JOB ERROR ==========")
        print(traceback.format_exc())

        return {
            "jobs": [],
            "message": str(e)
        }

    
@app.post("/calendar/add")
async def add_calendar_event(
    req: CalendarEventRequest
):

    session = user_sessions.get(
        req.session_id
    )

    if not session:
        return {
            "success": False,
            "message": "Invalid session"
        }

    event = {
        "id": str(uuid.uuid4()),
        "title": req.title,
        "date": req.date,
        "description": req.description,
        "event_type": req.event_type
    }

    session["calendar"].append(
        event
    )

    return {
        "success": True,
        "event": event
    }

@app.get("/calendar/list")
async def list_calendar_events(
    session_id: str
):

    session = user_sessions.get(
        session_id
    )

    if not session:
        return {
            "success": False,
            "events": []
        }

    return {
        "success": True,
        "events": session["calendar"]
    }


@app.delete("/calendar/delete")
async def delete_calendar_event(
    req: DeleteCalendarEventRequest
):

    session = user_sessions.get(
        req.session_id
    )

    if not session:
        return {
            "success": False
        }

    session["calendar"] = [
        event
        for event in session["calendar"]
        if event["id"] != req.event_id
    ]

    return {
        "success": True
    }
@app.post("/todo/add")
async def add_todo(req: TodoRequest):

    session = user_sessions.get(req.session_id)

    if not session:
        return {
            "success": False,
            "message": "Invalid session"
        }

    todo = {
        "id": str(uuid.uuid4()),
        "title": req.title,
        "deadline": req.deadline
    }

    session["todos"].append(todo)

    return {
        "success": True,
        "todo": todo
    }


@app.get("/todo/list")
async def list_todos(session_id: str):

    session = user_sessions.get(session_id)

    if not session:
        return {
            "success": False,
            "todos": []
        }

    return {
        "success": True,
        "todos": session["todos"]
    }

@app.post("/tracker/add")
async def add_tracker(req: TrackerRequest):

    session = user_sessions.get(req.session_id)

    if not session:
        return {
            "success": False
        }

    application = {
        "id": str(uuid.uuid4()),
        "role": req.role,
        "company": req.company,
        "stage": req.stage
    }

    session["tracker"].append(application)

    return {
        "success": True,
        "application": application
    }


@app.get("/tracker/list")
async def tracker_list(session_id: str):

    session = user_sessions.get(session_id)

    if not session:
        return {
            "success": False,
            "applications": []
        }

    return {
        "success": True,
        "applications": session["tracker"]
    }


@app.put("/tracker/update-stage")
async def update_stage(req: TrackerUpdateRequest):

    session = user_sessions.get(req.session_id)

    if not session:
        return {"success": False}

    for application in session["tracker"]:
        if application["id"] == req.application_id:
            application["stage"] = req.stage

    return {"success": True}