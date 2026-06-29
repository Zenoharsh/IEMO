# IEMO Opus

IEMO Opus is an AI-powered intelligent email engine. It features a Next.js (React) frontend heavily utilizing Shadcn/Radix UI components, paired with a FastAPI backend running Python.

The system connects to your Gmail, fetches recent emails, and leverages a LangChain agent to provide smart categorizations, urgency scores, and automated draft replies.

## Project Structure

- `/frontend`: Next.js 16 UI application.
- `/backend`: FastAPI Python server containing the core AI agent logic and Gmail integrations.

## Setup Instructions

### Backend
1. Navigate to `backend/`
2. Create a virtual environment: `python -m venv venv`
3. Activate it and install requirements: `pip install -r requirements.txt`
4. Set up your `.env` variables (e.g. `SUPABASE_URL`, `SUPABASE_KEY`).
5. Run the server: `python main.py` or `uvicorn main:app --reload`
*Note: Make sure your `credentials.json` for Gmail OAuth is placed in the backend folder.*

### Frontend
1. Navigate to `frontend/`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`

Navigate to `http://localhost:3000` to access the application. The frontend communicates with the backend running on `http://127.0.0.1:8000`.
