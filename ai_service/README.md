# AI Service

Python microservice (Flask or FastAPI) for ML risk scoring and Gemini API integration. Receives data from backend and returns risk scores and explanations.

## Setup
1. Create virtual environment and install dependencies:
   ```bash
   cd ai_service
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
2. Start service:
   ```bash
   python app.py
   ```

## Features
- ML model for credit risk scoring
- LLM API (Gemini) for decision explanations
