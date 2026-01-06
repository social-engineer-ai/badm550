"""
Testing API endpoints for collecting manual test feedback.
These endpoints are public (no auth required) to allow external testers.
"""
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel, EmailStr
from ..database import get_db
from ..models.features import TestFeedback

router = APIRouter(
    prefix="/test-feedback",
    tags=["testing"]
)

# ============== SCHEMAS ==============

class IssueDetail(BaseModel):
    test_case: str
    description: str
    severity: str  # critical, high, medium, low

class TestFeedbackCreate(BaseModel):
    tester_name: str
    tester_email: Optional[str] = None
    section: str  # A, B, C, D, E, F
    tests_passed: int
    tests_total: int
    issues: Optional[List[IssueDetail]] = []
    notes: Optional[str] = None
    browser: Optional[str] = None
    os_info: Optional[str] = None

class TestFeedbackResponse(BaseModel):
    id: int
    tester_name: str
    section: str
    tests_passed: int
    tests_total: int
    pass_rate: float

    class Config:
        from_attributes = True

# ============== ENDPOINTS ==============

@router.post("", response_model=TestFeedbackResponse)
async def submit_test_feedback(data: TestFeedbackCreate, db: Session = Depends(get_db)):
    """Submit test feedback from a manual tester"""
    # Validate section
    valid_sections = ["A", "B", "C", "D", "E", "F"]
    if data.section.upper() not in valid_sections:
        raise HTTPException(status_code=400, detail=f"Invalid section. Must be one of: {valid_sections}")

    # Validate tests_passed <= tests_total
    if data.tests_passed > data.tests_total:
        raise HTTPException(status_code=400, detail="tests_passed cannot exceed tests_total")

    feedback = TestFeedback(
        tester_name=data.tester_name,
        tester_email=data.tester_email,
        section=data.section.upper(),
        tests_passed=data.tests_passed,
        tests_total=data.tests_total,
        issues=[issue.model_dump() for issue in data.issues] if data.issues else [],
        notes=data.notes,
        browser=data.browser,
        os_info=data.os_info
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)

    return TestFeedbackResponse(
        id=feedback.id,
        tester_name=feedback.tester_name,
        section=feedback.section,
        tests_passed=feedback.tests_passed,
        tests_total=feedback.tests_total,
        pass_rate=round(feedback.tests_passed / feedback.tests_total * 100, 1) if feedback.tests_total > 0 else 0
    )

@router.get("")
async def list_test_feedback(db: Session = Depends(get_db)):
    """Get all test feedback submissions"""
    feedbacks = db.query(TestFeedback).order_by(TestFeedback.created_at.desc()).all()

    result = []
    for fb in feedbacks:
        result.append({
            "id": fb.id,
            "tester_name": fb.tester_name,
            "tester_email": fb.tester_email,
            "section": fb.section,
            "tests_passed": fb.tests_passed,
            "tests_total": fb.tests_total,
            "pass_rate": round(fb.tests_passed / fb.tests_total * 100, 1) if fb.tests_total > 0 else 0,
            "issues": fb.issues or [],
            "notes": fb.notes,
            "browser": fb.browser,
            "os_info": fb.os_info,
            "created_at": fb.created_at.isoformat() if fb.created_at else None
        })
    return result

@router.get("/summary")
async def get_test_summary(db: Session = Depends(get_db)):
    """Get aggregated test results summary"""
    feedbacks = db.query(TestFeedback).all()

    section_totals = {
        "A": {"name": "Authentication", "expected": 5},
        "B": {"name": "Teacher Dashboard", "expected": 6},
        "C": {"name": "Project Management", "expected": 7},
        "D": {"name": "Team Management", "expected": 6},
        "E": {"name": "Student Features", "expected": 7},
        "F": {"name": "TA Permissions", "expected": 5}
    }

    summary = {}
    all_issues = []

    for section, info in section_totals.items():
        section_feedbacks = [fb for fb in feedbacks if fb.section == section]
        if section_feedbacks:
            # Get the most recent submission for this section
            latest = max(section_feedbacks, key=lambda x: x.created_at if x.created_at else 0)
            summary[section] = {
                "name": info["name"],
                "tests_passed": latest.tests_passed,
                "tests_total": latest.tests_total,
                "pass_rate": round(latest.tests_passed / latest.tests_total * 100, 1) if latest.tests_total > 0 else 0,
                "tester": latest.tester_name,
                "submitted_at": latest.created_at.isoformat() if latest.created_at else None,
                "submissions_count": len(section_feedbacks)
            }
            if latest.issues:
                for issue in latest.issues:
                    issue["section"] = section
                    all_issues.append(issue)
        else:
            summary[section] = {
                "name": info["name"],
                "tests_passed": 0,
                "tests_total": info["expected"],
                "pass_rate": 0,
                "tester": None,
                "submitted_at": None,
                "submissions_count": 0
            }

    total_passed = sum(s["tests_passed"] for s in summary.values())
    total_tests = sum(s["tests_total"] for s in summary.values())

    return {
        "sections": summary,
        "overall": {
            "total_passed": total_passed,
            "total_tests": total_tests,
            "pass_rate": round(total_passed / total_tests * 100, 1) if total_tests > 0 else 0
        },
        "issues": all_issues,
        "issues_by_severity": {
            "critical": len([i for i in all_issues if i.get("severity") == "critical"]),
            "high": len([i for i in all_issues if i.get("severity") == "high"]),
            "medium": len([i for i in all_issues if i.get("severity") == "medium"]),
            "low": len([i for i in all_issues if i.get("severity") == "low"])
        }
    }

@router.get("/form", response_class=HTMLResponse)
async def get_feedback_form():
    """Serve the HTML feedback form"""
    return """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BADM 550 - Test Feedback Form</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 700px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            padding: 40px;
        }
        h1 {
            color: #1a1a2e;
            margin-bottom: 10px;
            font-size: 28px;
        }
        .subtitle {
            color: #666;
            margin-bottom: 30px;
            font-size: 14px;
        }
        .form-group {
            margin-bottom: 24px;
        }
        label {
            display: block;
            font-weight: 600;
            color: #333;
            margin-bottom: 8px;
            font-size: 14px;
        }
        .required::after {
            content: " *";
            color: #e74c3c;
        }
        input[type="text"], input[type="email"], input[type="number"], select, textarea {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s, box-shadow 0.3s;
        }
        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
        }
        .row {
            display: flex;
            gap: 16px;
        }
        .row .form-group {
            flex: 1;
        }
        .section-select {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
        }
        .section-option {
            position: relative;
        }
        .section-option input {
            position: absolute;
            opacity: 0;
        }
        .section-option label {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 16px;
            border: 2px solid #e0e0e0;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s;
        }
        .section-option input:checked + label {
            border-color: #667eea;
            background: rgba(102, 126, 234, 0.1);
        }
        .section-option label:hover {
            border-color: #667eea;
        }
        .section-letter {
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
        }
        .section-name {
            font-size: 11px;
            color: #666;
            text-align: center;
            margin-top: 4px;
        }
        .issues-container {
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            padding: 16px;
        }
        .issue-item {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 12px;
            position: relative;
        }
        .issue-item .row {
            margin-bottom: 12px;
        }
        .issue-item .row:last-child {
            margin-bottom: 0;
        }
        .remove-issue {
            position: absolute;
            top: 8px;
            right: 8px;
            background: #e74c3c;
            color: white;
            border: none;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            cursor: pointer;
            font-size: 14px;
        }
        .add-issue {
            background: none;
            border: 2px dashed #667eea;
            color: #667eea;
            padding: 12px;
            border-radius: 8px;
            cursor: pointer;
            width: 100%;
            font-size: 14px;
            font-weight: 600;
        }
        .add-issue:hover {
            background: rgba(102, 126, 234, 0.1);
        }
        .submit-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }
        .submit-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        .success-message {
            background: #2ecc71;
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            display: none;
            margin-top: 20px;
        }
        .error-message {
            background: #e74c3c;
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            display: none;
            margin-top: 20px;
        }
        .help-text {
            font-size: 12px;
            color: #888;
            margin-top: 4px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>BADM 550 Test Feedback</h1>
        <p class="subtitle">Submit your manual testing results for the Course Operating System</p>

        <form id="feedbackForm">
            <div class="row">
                <div class="form-group">
                    <label class="required">Your Name</label>
                    <input type="text" name="tester_name" required placeholder="John Doe">
                </div>
                <div class="form-group">
                    <label>Email (optional)</label>
                    <input type="email" name="tester_email" placeholder="john@illinois.edu">
                </div>
            </div>

            <div class="form-group">
                <label class="required">Test Section</label>
                <div class="section-select">
                    <div class="section-option">
                        <input type="radio" name="section" value="A" id="section-a" required>
                        <label for="section-a">
                            <span class="section-letter">A</span>
                            <span class="section-name">Authentication</span>
                        </label>
                    </div>
                    <div class="section-option">
                        <input type="radio" name="section" value="B" id="section-b">
                        <label for="section-b">
                            <span class="section-letter">B</span>
                            <span class="section-name">Teacher Dashboard</span>
                        </label>
                    </div>
                    <div class="section-option">
                        <input type="radio" name="section" value="C" id="section-c">
                        <label for="section-c">
                            <span class="section-letter">C</span>
                            <span class="section-name">Project Mgmt</span>
                        </label>
                    </div>
                    <div class="section-option">
                        <input type="radio" name="section" value="D" id="section-d">
                        <label for="section-d">
                            <span class="section-letter">D</span>
                            <span class="section-name">Team Mgmt</span>
                        </label>
                    </div>
                    <div class="section-option">
                        <input type="radio" name="section" value="E" id="section-e">
                        <label for="section-e">
                            <span class="section-letter">E</span>
                            <span class="section-name">Student Features</span>
                        </label>
                    </div>
                    <div class="section-option">
                        <input type="radio" name="section" value="F" id="section-f">
                        <label for="section-f">
                            <span class="section-letter">F</span>
                            <span class="section-name">TA Permissions</span>
                        </label>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="form-group">
                    <label class="required">Tests Passed</label>
                    <input type="number" name="tests_passed" min="0" required placeholder="0">
                </div>
                <div class="form-group">
                    <label class="required">Total Tests</label>
                    <input type="number" name="tests_total" min="1" required placeholder="5">
                    <p class="help-text">A=5, B=6, C=7, D=6, E=7, F=5</p>
                </div>
            </div>

            <div class="row">
                <div class="form-group">
                    <label>Browser</label>
                    <select name="browser">
                        <option value="">Select browser...</option>
                        <option value="Chrome">Chrome</option>
                        <option value="Firefox">Firefox</option>
                        <option value="Safari">Safari</option>
                        <option value="Edge">Edge</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Operating System</label>
                    <select name="os_info">
                        <option value="">Select OS...</option>
                        <option value="Windows 11">Windows 11</option>
                        <option value="Windows 10">Windows 10</option>
                        <option value="macOS">macOS</option>
                        <option value="Linux">Linux</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label>Issues Found</label>
                <div class="issues-container">
                    <div id="issues-list"></div>
                    <button type="button" class="add-issue" onclick="addIssue()">+ Add Issue</button>
                </div>
            </div>

            <div class="form-group">
                <label>Additional Notes</label>
                <textarea name="notes" rows="4" placeholder="Any other observations, suggestions, or comments..."></textarea>
            </div>

            <button type="submit" class="submit-btn">Submit Feedback</button>
        </form>

        <div class="success-message" id="successMsg">
            <strong>Thank you!</strong> Your feedback has been submitted successfully.
        </div>
        <div class="error-message" id="errorMsg">
            <strong>Error:</strong> <span id="errorText"></span>
        </div>
    </div>

    <script>
        let issueCount = 0;

        function addIssue() {
            issueCount++;
            const issueHtml = `
                <div class="issue-item" id="issue-${issueCount}">
                    <button type="button" class="remove-issue" onclick="removeIssue(${issueCount})">&times;</button>
                    <div class="row">
                        <div class="form-group">
                            <label>Test Case</label>
                            <input type="text" name="issue_test_case_${issueCount}" placeholder="e.g., A1, B3">
                        </div>
                        <div class="form-group">
                            <label>Severity</label>
                            <select name="issue_severity_${issueCount}">
                                <option value="low">Low</option>
                                <option value="medium" selected>Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <input type="text" name="issue_description_${issueCount}" placeholder="Describe what went wrong...">
                    </div>
                </div>
            `;
            document.getElementById('issues-list').insertAdjacentHTML('beforeend', issueHtml);
        }

        function removeIssue(id) {
            document.getElementById(`issue-${id}`).remove();
        }

        document.getElementById('feedbackForm').addEventListener('submit', async function(e) {
            e.preventDefault();

            const form = e.target;
            const submitBtn = form.querySelector('.submit-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';

            // Collect issues
            const issues = [];
            document.querySelectorAll('.issue-item').forEach(item => {
                const id = item.id.split('-')[1];
                const testCase = form.querySelector(`[name="issue_test_case_${id}"]`)?.value;
                const severity = form.querySelector(`[name="issue_severity_${id}"]`)?.value;
                const description = form.querySelector(`[name="issue_description_${id}"]`)?.value;

                if (testCase && description) {
                    issues.push({ test_case: testCase, severity: severity, description: description });
                }
            });

            const data = {
                tester_name: form.tester_name.value,
                tester_email: form.tester_email.value || null,
                section: form.section.value,
                tests_passed: parseInt(form.tests_passed.value),
                tests_total: parseInt(form.tests_total.value),
                browser: form.browser.value || null,
                os_info: form.os_info.value || null,
                notes: form.notes.value || null,
                issues: issues
            };

            try {
                const response = await fetch('/api/v1/test-feedback', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    document.getElementById('successMsg').style.display = 'block';
                    document.getElementById('errorMsg').style.display = 'none';
                    form.reset();
                    document.getElementById('issues-list').innerHTML = '';
                    issueCount = 0;
                } else {
                    const error = await response.json();
                    throw new Error(error.detail || 'Submission failed');
                }
            } catch (err) {
                document.getElementById('errorText').textContent = err.message;
                document.getElementById('errorMsg').style.display = 'block';
                document.getElementById('successMsg').style.display = 'none';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Feedback';
            }
        });
    </script>
</body>
</html>
"""
