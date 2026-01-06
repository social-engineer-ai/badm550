# BADM 550 Course Operating System
## Test Feedback Collection

**Last Updated:** January 2026

---

## Overview

There are three ways testers can submit their testing feedback:

1. **Web Form** (Recommended) - Built-in HTML form served by the backend
2. **Google Form** - External form that can be manually reviewed
3. **API Endpoint** - Direct programmatic submission

---

## Option 1: Built-in Web Form (Recommended)

### URL
```
http://localhost:8000/api/v1/test-feedback/form
```

### Features
- Modern, user-friendly interface
- Real-time validation
- Issue tracking with severity levels
- Direct database submission
- No authentication required

### How to Use
1. Share the URL with testers
2. Testers fill out the form after completing their assigned section
3. Results are automatically stored in the database
4. View results at `/api/v1/test-feedback` or `/api/v1/test-feedback/summary`

---

## Option 2: Google Form Template

If you prefer to use Google Forms, create a form with the following structure:

### Required Fields

| Question | Type | Options/Validation |
|----------|------|-------------------|
| Your Name | Short answer | Required |
| Email | Short answer | Email validation |
| Test Section | Multiple choice | A, B, C, D, E, F |
| Tests Passed | Number | Min: 0 |
| Total Tests in Section | Number | Min: 1 |

### Optional Fields

| Question | Type | Options/Validation |
|----------|------|-------------------|
| Browser Used | Multiple choice | Chrome, Firefox, Safari, Edge, Other |
| Operating System | Multiple choice | Windows 11, Windows 10, macOS, Linux, Other |
| Additional Notes | Paragraph | - |

### Issues Section (Repeated for each issue)

| Question | Type | Options |
|----------|------|---------|
| Issue Found? | Multiple choice | Yes, No |
| Test Case ID | Short answer | e.g., A1, B3 |
| Issue Description | Paragraph | - |
| Severity | Multiple choice | Critical, High, Medium, Low |

### Google Form Setup Instructions

1. Go to [Google Forms](https://forms.google.com)
2. Create a new blank form
3. Add each field from the tables above
4. Enable "Collect email addresses" in Settings
5. Enable "Response receipts" for tester confirmation
6. Create a linked Google Sheet for responses
7. Share form link with testers

### Exporting to Database

To import Google Form responses to the database:

```python
# Example script: import_google_form.py
import csv
import requests

API_URL = "http://localhost:8000/api/v1/test-feedback"

def import_from_csv(csv_path):
    with open(csv_path, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            data = {
                "tester_name": row["Your Name"],
                "tester_email": row.get("Email"),
                "section": row["Test Section"],
                "tests_passed": int(row["Tests Passed"]),
                "tests_total": int(row["Total Tests in Section"]),
                "browser": row.get("Browser Used"),
                "os_info": row.get("Operating System"),
                "notes": row.get("Additional Notes"),
                "issues": []  # Parse issues separately if needed
            }
            response = requests.post(API_URL, json=data)
            print(f"Imported: {data['tester_name']} - Section {data['section']}")

if __name__ == "__main__":
    import_from_csv("google_form_responses.csv")
```

---

## Option 3: API Endpoint

### Submit Feedback
```bash
POST http://localhost:8000/api/v1/test-feedback
Content-Type: application/json

{
  "tester_name": "John Doe",
  "tester_email": "john@illinois.edu",
  "section": "A",
  "tests_passed": 5,
  "tests_total": 5,
  "issues": [
    {
      "test_case": "A1",
      "description": "Login button unresponsive on first click",
      "severity": "medium"
    }
  ],
  "notes": "Overall authentication works well",
  "browser": "Chrome",
  "os_info": "Windows 11"
}
```

### Response
```json
{
  "id": 1,
  "tester_name": "John Doe",
  "section": "A",
  "tests_passed": 5,
  "tests_total": 5,
  "pass_rate": 100.0
}
```

### List All Feedback
```bash
GET http://localhost:8000/api/v1/test-feedback
```

### Get Summary
```bash
GET http://localhost:8000/api/v1/test-feedback/summary
```

Returns aggregated results across all sections with:
- Per-section pass rates
- Overall pass rate
- Issues grouped by severity
- Most recent tester per section

---

## Viewing Results

### API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/test-feedback` | List all submissions |
| `GET /api/v1/test-feedback/summary` | Aggregated summary |
| `GET /api/v1/test-feedback/form` | HTML submission form |

### Example Summary Response

```json
{
  "sections": {
    "A": {
      "name": "Authentication",
      "tests_passed": 5,
      "tests_total": 5,
      "pass_rate": 100.0,
      "tester": "John Doe",
      "submitted_at": "2026-01-06T10:30:00",
      "submissions_count": 1
    },
    "B": {
      "name": "Teacher Dashboard",
      "tests_passed": 6,
      "tests_total": 6,
      "pass_rate": 100.0,
      "tester": "Jane Smith",
      "submitted_at": "2026-01-06T11:15:00",
      "submissions_count": 1
    }
    // ... other sections
  },
  "overall": {
    "total_passed": 34,
    "total_tests": 36,
    "pass_rate": 94.4
  },
  "issues": [
    {
      "test_case": "C3",
      "description": "Save button sometimes needs double-click",
      "severity": "low",
      "section": "C"
    }
  ],
  "issues_by_severity": {
    "critical": 0,
    "high": 0,
    "medium": 0,
    "low": 1
  }
}
```

---

## Test Section Reference

| Section | Name | Test Count | Estimated Time |
|---------|------|------------|----------------|
| A | Authentication | 5 | 10 min |
| B | Teacher Dashboard | 6 | 20 min |
| C | Project Management | 7 | 25 min |
| D | Team Management | 6 | 20 min |
| E | Student Features | 7 | 25 min |
| F | TA Permissions | 5 | 15 min |
| **Total** | | **36** | **~2 hours** |

---

## Severity Levels

| Level | Description | Examples |
|-------|-------------|----------|
| **Critical** | System crash, data loss, security issue | Database errors, authentication bypass |
| **High** | Feature broken, blocking workflow | Cannot submit form, navigation broken |
| **Medium** | Feature partially works, workaround exists | Button needs double-click, slow loading |
| **Low** | Cosmetic, minor UX issue | Typo, alignment issue, wrong color |

---

## Support

For questions about testing or the feedback system:
- GitHub: https://github.com/social-engineer-ai/badm550
- Email: [System Administrator]
