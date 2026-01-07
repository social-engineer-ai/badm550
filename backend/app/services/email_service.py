import os
from sqlalchemy.orm import Session
import pickle
import json
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from .ai_service import ai_service
from ..config import settings
from ..models.features import EmailDraft, Alert, AlertPriority
from ..database import SessionLocal

SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send']

class EmailService:
    def __init__(self):
        self.creds = None
        # Token file stores user's access and refresh tokens
        self.token_path = 'token.pickle'
        self.creds_path = 'credentials.json'

    async def authenticate(self, db: Session = None, user_id: int = None, interactive: bool = False):
        """Standard Google OAuth2 flow with DB-backed token persistent storage.

        Args:
            db: Database session
            user_id: User ID for token storage
            interactive: If True, allow blocking OAuth flow (for CLI use only)
        """
        from google.oauth2.credentials import Credentials as OAuth2Credentials

        # 1. Try to load from DB or pickle
        token_data = None
        if db and user_id:
            from ..models.core import User
            user = db.query(User).filter(User.id == user_id).first()
            if user and user.oauth_token:
                token_data = user.oauth_token

        if not token_data and os.path.exists(self.token_path):
            with open(self.token_path, 'rb') as token:
                self.creds = pickle.load(token)
        elif token_data:
            self.creds = OAuth2Credentials.from_authorized_user_info(token_data, SCOPES)

        # 2. Refresh or Re-auth
        if not self.creds or not self.creds.valid:
            if self.creds and self.creds.expired and self.creds.refresh_token:
                try:
                    self.creds.refresh(Request())
                except Exception as e:
                    print(f"Failed to refresh token: {e}")
                    self.creds = None
                    return False
            else:
                # Only run interactive OAuth if explicitly requested (CLI mode)
                if interactive:
                    if not os.path.exists(self.creds_path) and settings.GOOGLE_CLIENT_ID:
                        client_config = {
                            "installed": {
                                "client_id": settings.GOOGLE_CLIENT_ID,
                                "project_id": settings.GOOGLE_PROJECT_ID,
                                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                                "token_uri": "https://oauth2.googleapis.com/token",
                                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                                "redirect_uris": ["http://localhost"]
                            }
                        }
                        flow = InstalledAppFlow.from_client_config(client_config, SCOPES)
                        self.creds = flow.run_local_server(port=0)
                    elif os.path.exists(self.creds_path):
                        flow = InstalledAppFlow.from_client_secrets_file(self.creds_path, SCOPES)
                        self.creds = flow.run_local_server(port=0)
                    else:
                        print("Gmail credentials not configured.")
                        return False
                else:
                    # Non-interactive mode: no valid token, return False to use mock data
                    print("Gmail not authenticated. Using mock data. Run OAuth setup to enable Gmail.")
                    return False
            
            # 3. Save new/refreshed token
            new_token_data = json.loads(self.creds.to_json())
            if db and user_id:
                from ..models.core import User
                user = db.query(User).filter(User.id == user_id).first()
                if user:
                    user.oauth_token = new_token_data
                    db.commit()
            
            with open(self.token_path, 'wb') as token:
                pickle.dump(self.creds, token)
                
        return True

    async def sync_and_process_inbox(self, db: Session = None, user_id: int = None):
        """Fetches new emails, clusters them using AI, and creates alerts/drafts."""
        if not await self.authenticate(db, user_id):
            return await self._mock_process_inbox()

        import base64
        service = build('gmail', 'v1', credentials=self.creds)
        
        # 1. Fetch unread messages
        results = service.users().messages().list(userId='me', q='is:unread').execute()
        messages = results.get('messages', [])
        
        email_data = []
        for msg in messages[:10]: # Process first 10 for safety
            full_msg = service.users().messages().get(userId='me', id=msg['id'], format='full').execute()
            payload = full_msg.get('payload', {})
            headers = payload.get('headers', [])
            
            subject = next((h['value'] for h in headers if h['name'].lower() == 'subject'), "No Subject")
            sender = next((h['value'] for h in headers if h['name'].lower() == 'from'), "Unknown")
            
            # Get body
            body = ""
            if 'parts' in payload:
                for part in payload['parts']:
                    if part['mimeType'] == 'text/plain':
                        data = part['body'].get('data', '')
                        body = base64.urlsafe_b64decode(data).decode('utf-8')
                        break
            elif 'body' in payload:
                data = payload['body'].get('data', '')
                if data:
                    body = base64.urlsafe_b64decode(data).decode('utf-8')

            email_data.append({
                "id": msg['id'],
                "from": sender,
                "subject": subject,
                "body": body
            })

            # Mark as read/processed (optional, maybe just label it)
            # service.users().messages().batchModify(userId='me', body={'removeLabelIds': ['UNREAD'], 'ids': [msg['id']]}).execute()

        if not email_data:
            return {"status": "success", "message": "No new messages found."}

        # 2. Process with AI
        analysis = await ai_service.summarize_inbox(email_data)
        
        # 3. Save to DB
        db = SessionLocal()
        try:
            if "urgent_alerts" in analysis:
                for alert_data in analysis["urgent_alerts"]:
                    new_alert = Alert(
                        type="ai_detected_urgent",
                        message=alert_data.get('reason', 'Urgent issue'),
                        priority=AlertPriority.HIGH
                    )
                    db.add(new_alert)
            
            if "clusters" in analysis:
                for cluster in analysis["clusters"]:
                    new_draft = EmailDraft(
                        recipient_email=cluster.get('primary_recipient', 'instructor@illinois.edu'),
                        subject=f"Follow-up: {cluster.get('topic', 'Course Guidance')}",
                        body=cluster.get('draft_response', 'AI drafting...'),
                        context_data={"email_ids": cluster.get('ids', [])}
                    )
                    db.add(new_draft)
            
            db.commit()
            return analysis
        finally:
            db.close()

    async def _mock_process_inbox(self):
        """Simulates an inbox process for development/testing."""
        mock_emails = [
            {"id": "mock_1", "from": "student1@illinois.edu", "subject": "Week 3 Question", "body": "I am confused about the price gap calculation in Q1 data slice."},
            {"id": "mock_2", "from": "student2@illinois.edu", "subject": "Data Error?", "body": "The column 'rev_adj' seems missing for KC division teams."},
            {"id": "mock_3", "from": "student3@illinois.edu", "subject": "Meeting request", "body": "Can our team AWG-3 meet you tomorrow at 2pm?"}
        ]

        # Use AIService to cluster and summarize
        analysis = await ai_service.summarize_inbox(mock_emails)
        
        # In a real run, we would iterate through analysis and create DB objects
        db = SessionLocal()
        try:
            # Create a mock alert for the 'urgent' ones
            if "urgent_alerts" in analysis:
                for alert_data in analysis["urgent_alerts"]:
                    new_alert = Alert(
                        type="ai_detected_urgent",
                        message=f"AI Alert: {alert_data.get('subject', 'Urgent issue')}",
                        priority=AlertPriority.HIGH
                    )
                    db.add(new_alert)
            
            # Create drafts for clusters
            if "clusters" in analysis:
                for cluster in analysis["clusters"]:
                    # Create a generic draft for the cluster
                    new_draft = EmailDraft(
                        recipient_email="multiple_students@illinois.edu",
                        subject=f"Follow-up: {cluster.get('topic', 'Course Guidance')}",
                        body="AI would draft a response covering this cluster here...",
                        context_data={"cluster_info": cluster}
                    )
                    db.add(new_draft)
            
            db.commit()
            return analysis
        finally:
            db.close()

    async def send_bulk_pulse_invitation(self, db: Session, instructor_id: int):
        """Sends a 'Taco Tuesday' pulse check invitation to all students."""
        from ..models.core import User, UserRole
        from email.mime.text import MIMEText
        import base64

        # 1. Authenticate as instructor
        if not await self.authenticate(db, instructor_id):
            print("Failed to authenticate instructor for bulk pulse.")
            return

        # 2. Get all students
        students = db.query(User).filter(User.role == UserRole.STUDENT).all()
        
        service = build('gmail', 'v1', credentials=self.creds)
        
        for student in students:
            # Build Email
            body = (
                f"Hi {student.first_name},\n\n"
                f"Happy Taco Tuesday! 🌮\n\n"
                f"It's time for our bi-weekly team sentiment pulse check. "
                f"Please take 10 seconds to let us know how your team is feeling:\n\n"
                f"👉 http://localhost:3000/student\n\n"
                f"Your feedback helps us ensure every team has the support they need.\n\n"
                f"Best,\n"
                f"BADM 550 Course Team"
            )
            
            message = MIMEText(body)
            message['to'] = student.email
            message['subject'] = "🌮 Taco Tuesday: How's your team doing?"
            
            raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode('utf-8')
            
            try:
                service.users().messages().send(userId='me', body={'raw': raw_message}).execute()
            except Exception as e:
                print(f"Failed to send pulse to {student.email}: {e}")

        return {"status": "success", "count": len(students)}

email_service = EmailService()
