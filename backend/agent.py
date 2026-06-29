from dotenv import load_dotenv
load_dotenv()

import os
from typing import Literal
from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from opik import track
from opik.integrations.langchain import OpikTracer

# 1. Setup Gemini (Your "Brain")
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0,
    google_api_key=os.getenv("GOOGLE_API_KEY")
)

# 2. THE SUPER-STRUCTURE (Includes OLD fields + NEW draft field)
class EmailAnalysis(BaseModel):
    # --- OLD FIELDS (Keep these!) ---
    category: Literal["Urgent_Action", "Meeting_Request", "Finance_Bill", "Newsletter", "Spam", "Personal_Planning"] = Field(..., description="Classify based on context.")
    urgency_score: int = Field(..., description="0-10 score. 10 = Critical.")
    summary: str = Field(..., description="1-sentence executive summary.")
    suggested_action: str = Field(..., description="Short action label (e.g. 'Reply', 'Archive').")
    reasoning: str = Field(..., description="Why did you give this score?")
    
    # --- NEW FIELD (The Upgrade) ---
    reply_draft: str = Field(..., description="Write a polite, professional reply based on the context. If Spam, leave empty.")

# 3. THE AGENT
@track(name="Iemo Super-Agent")
def analyze_email(email_subject: str, email_body: str, inbox_context: str = "Work"):
    
    # Dynamic Persona (Work vs Personal)
    if inbox_context == "Work":
        persona = """You are a concise, professional Executive Assistant. 
        - Prioritize bugs, boss, and production issues.
        - Write brief, actionable replies. No fluff."""
    else:
        persona = """You are a friendly Personal Manager. 
        - Prioritize family and bills.
        - Write warm, casual replies. Be protective of my free time."""

    # The Prompt asks for BOTH analysis AND drafting
    prompt = ChatPromptTemplate.from_messages([
        ("system", f"{persona}\n\nTask: Analyze this email, categorize it, AND draft a reply if necessary."),
        ("human", "Subject: {subject}\nBody: {body}")
    ])

    # Bind the Super-Structure
    structured_llm = llm.with_structured_output(EmailAnalysis)
    opik_tracer = OpikTracer(tags=["Iemo_v2", f"Context:{inbox_context}"])

    try:
        chain = prompt | structured_llm
        response = chain.invoke(
            {"subject": email_subject, "body": email_body},
            config={"callbacks": [opik_tracer]}
        )
        return response
    except Exception as e:
        # Safe Fallback
        return EmailAnalysis(
            category="Spam", 
            urgency_score=0, 
            summary="Error processing email",
            suggested_action="Error", 
            reasoning=str(e), 
            reply_draft=""
        )