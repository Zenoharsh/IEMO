from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import re 

# Import Supabase
from supabase import create_client, Client

# Import Agent & Gmail Logic
from agent import analyze_email
from gmail_service import fetch_recent_emails

load_dotenv()

# --- CONNECT TO MEMORY ---
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key) if url and key else None

app = FastAPI(title="IEMO Opus API", version="2.5 (Turbo)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    subject: str
    body: str
    context: str = "Work"

# --- ROBUST HEADER EXTRACTION ---
def extract_header(email_data, header_name):
    """
    Hunts for a header recursively and cleans it up.
    """
    target = header_name.lower()
    value = None
    
    # 1. Search in payload headers (Standard)
    payload = email_data.get('payload', {})
    headers = payload.get('headers', [])
    for h in headers:
        if h.get('name', '').lower() == target:
            value = h.get('value')
            break
            
    # 2. Search in top-level (Fallback)
    if not value and header_name in email_data:
        value = email_data[header_name]

    return value

def clean_sender(sender_str):
    """
    Turns 'John Doe <john@example.com>' into 'John Doe'
    """
    if not sender_str: return "Unknown Sender"
    # Split by < and take the first part
    name = sender_str.split('<')[0].strip().replace('"', '')
    return name if name else sender_str

@app.get("/")
def health_check():
    return {"status": "Online 🚀"}

@app.get("/api/fetch-live")
def api_fetch_emails(limit: int = 6):
    """
    Fetches emails and analyzes them at FULL SPEED (Paid Tier).
    """
    try:
        if not os.path.exists("credentials.json"):
            raise HTTPException(status_code=400, detail="Missing credentials.json")
            
        print(f"📥 Fetching last {limit} emails...")
        raw_emails = fetch_recent_emails(limit)
        
        analyzed_results = []
        for email in raw_emails:
            # 1. Robust Extraction
            subject = extract_header(email, 'Subject') or "No Subject"
            sender_raw = extract_header(email, 'From')
            sender = clean_sender(sender_raw)
            body = email.get('snippet', '')
            
            print(f"   ⚡ Analyzing: {sender} | {subject[:30]}...")

            # 2. AI Analysis (No Sleep! Full Speed!)
            try:
                analysis = analyze_email(subject, body)
                category = analysis.category
                score = analysis.urgency_score
                reasoning = analysis.reasoning
                draft = analysis.reply_draft
            except Exception as e:
                print(f"   ⚠️ AI Error: {e}")
                # Fallback
                category = "Uncategorized"
                score = 0
                reasoning = "Analysis failed."
                draft = ""
            
            analyzed_results.append({
                "id": email.get('id'),
                "subject": subject,
                "sender": sender,
                "score": score,
                "category": category,
                "reasoning": reasoning,
                "draft": draft
            })
            
        return {"count": len(analyzed_results), "emails": analyzed_results}
        
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)