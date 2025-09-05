
# LoanAI: AI-Powered Loan Underwriting Platform for Rural & Semi-Urban India

LoanAI is a full-stack web application designed to automate and streamline loan underwriting for rural and semi-urban India. It features secure authentication, instant KYC validation with OCR, AI-powered risk scoring, and a conversational chatbot assistant. Built with React, Node.js, FastAPI, and MongoDB, LoanAI delivers a professional, mobile-friendly user experience and robust backend logic, including rate-limited LLM integration and advanced prompt engineering.

## Features
- Secure user authentication and registration
- Instant KYC upload and OCR validation
- AI-driven risk scoring and loan recommendations
- Conversational chatbot assistant (Gemini LLM)
- Responsive, modern UI/UX for desktop and mobile
- Rate limiting and caching to optimize API usage
- Modular, scalable codebase (React, Node.js, FastAPI, MongoDB)

## Tech Stack
- **Frontend:** React.js, Bootstrap, modular CSS
- **Backend:** Node.js, Express, MongoDB Atlas
- **AI Microservice:** Python, FastAPI, Gemini API, LangChain, slowapi

## Project Structure
- `frontend/` – React.js app (authentication, loan application, KYC, chatbot)
- `backend/` – Node.js + Express API (user management, loan data, KYC, proxy to AI)
- `ai_service/` – Python FastAPI microservice (risk scoring, LLM, rate limiting, caching)

## Setup Instructions
See each folder for setup details and environment configuration. Make sure to add your API keys and secrets to `.env` files (excluded from git).

## Usage
1. Install dependencies in each folder (`npm install`, `pip install -r requirements.txt`)
2. Start backend, frontend, and AI microservice servers
3. Access the app via the frontend URL

## Security & Privacy
Sensitive files and secrets are excluded via `.gitignore`. Do not commit `.env` or cache files.

## License
MIT
