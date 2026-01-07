import anthropic
import json
from typing import List, Dict, Any
from ..config import settings

class AIService:
    def __init__(self):
        # We check for the API key, but allow initialization for mock modes if needed
        self.api_key = settings.ANTHROPIC_API_KEY
        self.client = anthropic.Anthropic(api_key=self.api_key) if self.api_key else None
        self.model = "claude-sonnet-4-20250514"

    async def _call_claude(self, system_prompt: str, user_message: str, max_tokens: int = 1500, json_mode: bool = False):
        if not self.client:
            return "ANTHROPIC_API_KEY not set. Mock response: Claude is currently offline."
        
        try:
            # Note: For real JSON mode with Sonnet 3.5, we often just ask for it in the prompt
            # but we can also use tools if we want strict schema. For now, simple prompting.
            message = self.client.messages.create(
                model=self.model,
                max_tokens=max_tokens,
                system=system_prompt,
                messages=[
                    {"role": "user", "content": user_message}
                ]
            )
            content = message.content[0].text
            if json_mode:
                try:
                    # Attempt to find JSON block if Claude wrapped it
                    if "```json" in content:
                        content = content.split("```json")[1].split("```")[0].strip()
                    return json.loads(content)
                except:
                    return {"error": "Failed to parse AI JSON response", "raw": content}
            return content
        except Exception as e:
            print(f"Error in AIService call: {e}")
            return f"Error: {str(e)}"

    async def draft_email(self, student_query: str, context: str = ""):
        """DRAFTER: Generates a response to a student query."""
        system_prompt = (
            "You are the 'Digital TA' for BADM 550 (MSBA Business Practicum). "
            "Your goal is to draft a professional, helpful email response for the instructor to review. "
            "Guidelines:\n"
            "1. Do NOT provide direct answers to analytical challenges (e.g., 'What is the price gap?').\n"
            "2. Instead, guide them with Socratic questions or point them to specific course resources.\n"
            "3. Tone: Professional, encouraging, and efficient.\n"
            "4. Format the output as a ready-to-send email (Subject: ... Body: ...)."
        )
        user_message = f"Instructor Context: {context}\n\nStudent Query: {student_query}\n\nDraft the best response:"
        return await self._call_claude(system_prompt, user_message)

    async def summarize_inbox(self, emails: List[Dict[str, str]]):
        """SUMMARIZER: Processes multiple student emails to find clusters and urgent issues."""
        system_prompt = (
            "You are an AI triage assistant for the BADM 550 MSBA Business Practicum. "
            "Analyze the following student emails and produce a JSON summary for the Instructor's Daily Digest:\n"
            "1. 'urgent_alerts': Emails requiring immediate teacher intervention (technical blockers, team conflict, data errors). Each item: {id, reason, subject}.\n"
            "2. 'clusters': Group similar questions into topics. Each cluster: {topic, count, ids, draft_response, summary}.\n"
            "3. 'daily_statistics': {sentiment_score (0-10), pending_count}.\n"
            "4. 'daily_digest': A professional 3-sentence summary of overall student progress."
        )
        emails_text = "\n---\n".join([f"ID: {e['id']}\nFrom: {e['from']}\nSubject: {e['subject']}\nBody: {e['body']}" for e in emails])
        user_message = f"Incoming Emails:\n{emails_text}\n\nProvide the JSON analysis:"
        result = await self._call_claude(system_prompt, user_message, json_mode=True)

        # If API failed, return mock analysis
        if isinstance(result, str) and ("Error:" in result or "not set" in result.lower()):
            return {
                "urgent_alerts": [
                    {"id": emails[0]["id"] if emails else "mock_1", "reason": "Data column question - needs guidance", "subject": emails[0].get("subject", "Question")}
                ] if emails else [],
                "clusters": [
                    {
                        "topic": "Technical Questions",
                        "count": len(emails),
                        "ids": [e["id"] for e in emails],
                        "draft_response": "Thank you for your question. Please refer to the Week resources for guidance on this topic.",
                        "summary": f"Received {len(emails)} student inquiries"
                    }
                ],
                "daily_statistics": {"sentiment_score": 7, "pending_count": len(emails)},
                "daily_digest": f"Processed {len(emails)} mock emails. AI analysis unavailable - please check ANTHROPIC_API_KEY configuration.",
                "_mock": True,
                "_api_error": result
            }
        return result

    async def evaluate_submission(self, submission_text: str, week_rules: Dict[str, Any]):
        """AUTO-EVAL: Validates a student submission against the week's specific rules."""
        system_prompt = (
            "You are an expert analytical grader for the MSBA Business Practicum. "
            "Analyze the student's work based on the provided 'Validation Rules'. "
            "Return a JSON object with:\n"
            "1. 'status': 'passed' or 'flagged'.\n"
            "2. 'flags': List of specific issues (e.g., 'Missing price gap column', 'Incorrect revenue aggregation').\n"
            "3. 'feedback': A brief, helpful comment for the student.\n"
            "4. 'confidence_score': 0.0 to 1.0 representing your certainty in this evaluation."
        )
        user_message = (
            f"Validation Rules: {json.dumps(week_rules)}\n\n"
            f"Student Submission Content:\n{submission_text}\n\n"
            f"Evaluate and return JSON:"
        )
        return await self._call_claude(system_prompt, user_message, json_mode=True)

ai_service = AIService()

