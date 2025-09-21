# AI Code Review System

A full-stack application for automated code reviews powered by Large Language Models (via OpenRouter).  
Backend: FastAPI (Python), Frontend: React + Vite + TypeScript, Database: MongoDB.

## Technologies
- Backend: FastAPI, Pydantic, Uvicorn
- Frontend: React, Vite, TypeScript, TailwindCSS
- Database: MongoDB (Docker local or Atlas in production)
- Infra: Docker Compose for development, Render for backend, Vercel for frontend
- LLM Provider: OpenRouter

## Project structure
.
├── backend/              # FastAPI backend
│   ├── app/              # application code
│   ├── tests/            # unit tests
│   ├── Dockerfile        # backend container
│   ├── requirements.txt  # Python dependencies
│   └── .env.example      # environment variables example
│
├── frontend/             # React frontend
│   ├── src/              # frontend code
│   ├── Dockerfile        # frontend container
│   └── .env.example      # environment variables example
│
├── docker-compose.yml    # dev environment with backend, frontend, MongoDB
└── README.md

## Requirements
- Docker and Docker Compose installed
- OpenRouter account and API key
- MongoDB Atlas account (or local Docker MongoDB)

## Environment variables
Create `.env` files from the examples (`.env.example`). Do not commit `.env` with real keys.

### backend/.env
OPENAI_API_KEY=or-xxxxxxxxxxxxxxxx
OPENAI_BASE_URL=https://openrouter.ai/api
OPENAI_MODEL=meta-llama/llama-3.1-8b-instruct

MONGODB_URI=mongodb://mongo:27017
MONGODB_DB=ai_code_review

FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8000

### frontend/.env
VITE_BACKEND_URL=http://localhost:8000

## Development with Docker Compose
docker compose up --build

Services:
- Frontend → http://localhost:5173
- Backend → http://localhost:8000/docs
- MongoDB → localhost:27017

Stop containers:
docker compose down

## Production deployment

### Frontend (Vercel or Netlify)
- Project root: frontend/
- Build command: npm run build
- Output directory: dist
- Environment variable: VITE_BACKEND_URL=https://<backend-url>

### Backend (Render or Railway)
- Project root: backend/
- If using Dockerfile, Render will detect it
- Otherwise, build command: pip install -r requirements.txt
- Start command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
- Environment variables:
  - OPENAI_API_KEY
  - OPENAI_BASE_URL=https://openrouter.ai/api
  - OPENAI_MODEL=meta-llama/llama-3.1-8b-instruct
  - MONGODB_URI=<Atlas connection string>
  - MONGODB_DB=ai_code_review
  - FRONTEND_URL=https://<frontend-url>
  - BACKEND_URL=https://<backend-url>

### Database (MongoDB Atlas)
- Create a free cluster
- Add a user with username and password
- Allow access from 0.0.0.0/0 or Render IP
- Copy the connection string and use in MONGODB_URI

## Testing
1. Start the backend (/docs endpoint available)
2. Access the frontend
3. Paste a code snippet and submit
4. Backend will request LLM review and save result in MongoDB
5. Review result is displayed in frontend

## Local development without Docker (optional)

### Backend
cd backend
python -m venv .venv
source .venv/bin/activate   # Linux/macOS
.venv\Scripts\activate    # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

### Frontend
cd frontend
npm install
npm run dev

## Security notes
- Do not commit .env files with real keys
- Always use .env.example for documentation
- Rotate API keys if they are accidentally exposed
- Frontend VITE_* variables are public, never put secrets there

## License
MIT

