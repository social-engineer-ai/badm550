#!/usr/bin/env python3
"""
Gmail OAuth Setup Script for BADM 550 Course OS

This script runs the interactive Google OAuth flow to authenticate
your Gmail account. After completing this, the Sync feature will
work with your real Gmail inbox.

Usage:
    cd backend
    py -3 setup_gmail_oauth.py

Requirements:
    - Google Cloud project with Gmail API enabled
    - OAuth credentials configured in .env file
    - Your email added as a test user in Google Cloud Console
"""

import os
import sys
import pickle
import json

# Add the app directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()

from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send'
]

def main():
    print("=" * 60)
    print("BADM 550 - Gmail OAuth Setup")
    print("=" * 60)
    print()

    # Check for credentials
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
    project_id = os.getenv("GOOGLE_PROJECT_ID")

    if not client_id or not client_secret:
        print("ERROR: Google OAuth credentials not found in .env file")
        print()
        print("Please ensure your .env file contains:")
        print("  GOOGLE_CLIENT_ID=your-client-id")
        print("  GOOGLE_CLIENT_SECRET=your-client-secret")
        print("  GOOGLE_PROJECT_ID=your-project-id")
        sys.exit(1)

    print(f"Project ID: {project_id}")
    print(f"Client ID: {client_id[:20]}...")
    print()

    # Check for existing token
    token_path = 'token.pickle'
    creds = None

    if os.path.exists(token_path):
        print("Found existing token. Checking if valid...")
        with open(token_path, 'rb') as token:
            creds = pickle.load(token)

        if creds and creds.valid:
            print("Existing token is valid!")
            print(f"Authenticated as: {getattr(creds, 'token', 'unknown')[:20]}...")
            response = input("\nDo you want to re-authenticate? (y/N): ")
            if response.lower() != 'y':
                print("Keeping existing token.")
                sys.exit(0)
            creds = None
        elif creds and creds.expired and creds.refresh_token:
            print("Token expired. Attempting to refresh...")
            try:
                creds.refresh(Request())
                print("Token refreshed successfully!")
                with open(token_path, 'wb') as token:
                    pickle.dump(creds, token)
                sys.exit(0)
            except Exception as e:
                print(f"Failed to refresh: {e}")
                creds = None

    # Run OAuth flow
    print()
    print("Starting OAuth flow...")
    print("A browser window will open for you to authorize access.")
    print()

    client_config = {
        "installed": {
            "client_id": client_id,
            "project_id": project_id,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_secret": client_secret,
            "redirect_uris": ["http://localhost"]
        }
    }

    try:
        flow = InstalledAppFlow.from_client_config(client_config, SCOPES)
        creds = flow.run_local_server(port=0)
    except Exception as e:
        print(f"OAuth failed: {e}")
        print()
        print("Common issues:")
        print("1. Make sure the Gmail API is enabled in Google Cloud Console")
        print("2. Add your email as a test user in OAuth consent screen")
        print("3. Check that redirect URIs include 'http://localhost'")
        sys.exit(1)

    # Save the token
    with open(token_path, 'wb') as token:
        pickle.dump(creds, token)

    print()
    print("=" * 60)
    print("SUCCESS! Gmail OAuth setup complete.")
    print("=" * 60)
    print()
    print(f"Token saved to: {os.path.abspath(token_path)}")
    print()
    print("The Sync button in the dashboard will now use your real Gmail inbox.")
    print("You can re-run this script anytime to re-authenticate.")

if __name__ == "__main__":
    main()
