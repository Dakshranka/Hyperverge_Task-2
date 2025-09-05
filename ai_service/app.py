from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
limiter = Limiter(key_func=get_remote_address)
from fastapi import FastAPI, Request, Body
from pydantic import BaseModel
import re
import google.generativeai as genai
import os
from dotenv import load_dotenv
from langchain.cache import SQLiteCache
import time

# ------------------------------
# Setup
# ------------------------------
load_dotenv()
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
llm_cache = SQLiteCache(database_path="llm_cache.db")


# ------------------------------
# Loan Application Schema
# ------------------------------
class LoanApplication(BaseModel):
    name: str
    mobile: str
    email: str
    address: str
    city: str
    state: str
    pin: str
    aadhaar: str
    pan: str
    income: float
    incomeSource: str
    employer: str = None
    loanAmount: float
    loanPurpose: str
    loanDuration: int


# ------------------------------
# Utility functions
# ------------------------------
def validate_aadhaar(aadhaar: str) -> bool:
    """Basic Aadhaar validation: 12 digits"""
    return bool(re.fullmatch(r"\d{12}", aadhaar))


def validate_pan(pan: str) -> bool:
    """Basic PAN validation: 5 letters + 4 digits + 1 letter"""
    return bool(re.fullmatch(r"[A-Z]{5}[0-9]{4}[A-Z]", pan))


# ------------------------------
# Root Endpoint
# ------------------------------
@app.get("/")
def read_root():
    return {"message": "AI Service for Loan Underwriting"}


# ------------------------------
# Risk Score Endpoint
# ------------------------------
@app.post("/risk-score")
def risk_score(app_data: LoanApplication):
    # Aadhaar and PAN validation
    if not validate_aadhaar(app_data.aadhaar):
        return {"risk_score": 0.0, "decision": "rejected", "reason": "Invalid Aadhaar"}
    if not validate_pan(app_data.pan):
        return {"risk_score": 0.0, "decision": "rejected", "reason": "Invalid PAN"}

    # --- Rule-based risk score calculation ---
    payment_history = 0.9 if app_data.incomeSource.lower() == "salaried" else 0.7
    credit_utilization = min(float(app_data.loanAmount) / max(float(app_data.income), 1), 1)
    length_history = 0.7 if app_data.employer and len(app_data.employer) > 3 else 0.5

    diverse_purposes = ["education", "business", "medical", "home", "vehicle"]
    credit_mix = 0.8 if app_data.loanPurpose.lower() in diverse_purposes else 0.6

    new_credit = min(float(app_data.loanDuration) / 60, 1)

    # Weighted credit score
    credit_score = (
        payment_history * 0.35 +
        (1 - credit_utilization) * 0.30 +
        length_history * 0.15 +
        credit_mix * 0.10 +
        (1 - new_credit) * 0.10
    )

    PD = 1 - credit_score
    EAD = float(app_data.loanAmount)
    LGD = 0.6
    EL = PD * EAD * LGD
    risk_score_val = min(max(PD * LGD, 0), 1)

    if risk_score_val < 0.3:
        recommendation = "approve"
        explanation = "Loan approved. Applicant shows strong repayment capacity and low risk profile."
    elif risk_score_val < 0.6:
        recommendation = "approve with conditions"
        explanation = "Loan approved with conditions. Applicant has moderate risk due to loan amount or duration."
    else:
        recommendation = "reject"
        explanation = "Loan rejected. High risk due to income, loan amount, or credit factors."

    breakdown = {
        "Payment History": round(payment_history, 2),
        "Credit Utilization": round(credit_utilization, 2),
        "Length of Credit History": round(length_history, 2),
        "Credit Mix": round(credit_mix, 2),
        "New Credit": round(new_credit, 2)
    }

    return {
        "risk_score": round(risk_score_val, 2),
        "PD": round(PD, 2),
        "EAD": round(EAD, 2),
        "LGD": round(LGD, 2),
        "expected_loss": round(EL, 2),
        "breakdown": breakdown,
        "recommendation": recommendation,
        "explanation": explanation
    }


# ------------------------------
# Explanation Endpoint
# ------------------------------
@app.post("/explain")
@limiter.limit("2/minute")  # Lower rate limit for Gemini endpoints
async def explain_decision(request: Request):
    data = await request.json()
    decision = data.get("decision", "rejected")

    prompt = (
        f"A user applied for a loan and the decision was: {decision}. "
        "Why was this decision made? Give a short, clear explanation for a loan officer."
    )
    norm_prompt = prompt.strip().lower()
    cached_reply = llm_cache.lookup("gemini-1.5-flash", norm_prompt)
    if cached_reply:
        return {"explanation": cached_reply}
    try:
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        model = genai.GenerativeModel("gemini-1.5-flash")
        for attempt in range(3):
            try:
                response = model.generate_content(prompt)
                explanation = response.text.strip() if hasattr(response, "text") else "No explanation provided."
                llm_cache.update("gemini-1.5-flash", norm_prompt, explanation)
                return {"explanation": explanation}
            except Exception as e:
                if "rate limit" in str(e).lower():
                    time.sleep(2)  # Wait and retry
                else:
                    return {"explanation": f"Error: {str(e)}"}
        return {"explanation": "Rate limit exceeded. Please wait and try again."}
    except Exception as e:
        return {"explanation": f"Error: {str(e)}"}


# ------------------------------
# Conversational Chatbot Endpoint
# ------------------------------
@app.post("/chat")
@limiter.limit("2/minute")  # Lower rate limit for Gemini endpoints
async def chat_endpoint(request: Request, data: dict = Body(...)):
    message = data.get("message", "")
    if not message or not isinstance(message, str):
        return {"reply": "Please provide a valid message."}

    prompt = f"Reply concisely and crisply: {message}"
    norm_prompt = prompt.strip().lower()
    cached_reply = llm_cache.lookup("gemini-1.5-flash", norm_prompt)
    if cached_reply:
        return {"reply": cached_reply}
    try:
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        model = genai.GenerativeModel("gemini-1.5-flash")
        for attempt in range(3):
            try:
                response = model.generate_content(prompt)
                reply = response.text.strip() if hasattr(response, "text") else str(response)
                if not reply:
                    reply = "Sorry, I couldn't generate a response."
                # Optionally trim to 2-3 sentences max
                if len(reply.split('. ')) > 3:
                    reply = '. '.join(reply.split('. ')[:3]) + '.'
                llm_cache.update("gemini-1.5-flash", norm_prompt, reply)
                return {"reply": reply}
            except Exception as e:
                if "rate limit" in str(e).lower():
                    time.sleep(2)  # Wait and retry
                else:
                    return {"reply": f"Error: {str(e)}"}
        return {"reply": "Rate limit exceeded. Please wait and try again."}
    except Exception as e:
        return {"reply": f"Error: {str(e)}"}
