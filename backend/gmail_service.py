import os
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

def get_gmail_service():
    """Authenticates the user and returns the Gmail service object."""
    creds = None
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    token_path = os.path.join(BASE_DIR, 'token.json')
    creds_path = os.path.join(BASE_DIR, 'credentials.json')

    if os.path.exists(token_path):
        creds = Credentials.from_authorized_user_file(token_path, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                creds_path, SCOPES)
            creds = flow.run_local_server(port=0)
        with open(token_path, 'w') as token:
            token.write(creds.to_json())

    return build('gmail', 'v1', credentials=creds)

def fetch_recent_emails(limit=5):
    """
    Fetches the RAW email objects. 
    Does NOT extract subjects/bodies (main.py will do that).
    """
    service = get_gmail_service()
    
    # 1. Get the list of IDs
    results = service.users().messages().list(userId='me', labelIds=['INBOX'], maxResults=limit).execute()
    messages = results.get('messages', [])

    full_raw_emails = []
    
    if not messages:
        print("No messages found.")
        return []

    # 2. Fetch full raw content for each
    print(f"   gmail_service: Fetching raw content for {len(messages)} emails...")
    for msg in messages:
        try:
            # We ask for 'full' format so main.py can extract headers itself
            txt = service.users().messages().get(userId='me', id=msg['id'], format='full').execute()
            full_raw_emails.append(txt)
        except Exception as e:
            print(f"Error fetching message {msg['id']}: {e}")

    return full_raw_emails