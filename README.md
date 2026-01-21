
# Prospector AI - Property Surplus Case Manager

Enterprise-grade platform for Property Tax Surplus ("overages") recovery, featuring AI document extraction and human-in-the-loop workflows.

## Features
- **Case Dashboard**: Track hundreds of surplus opportunities across multiple states/counties.
- **AI Extraction**: Automatic OCR and LLM field parsing for deeds, tax bills, and IDs.
- **Jurisdiction Engine**: Smart calculation of claim deadlines based on county rules.
- **Human Approval Gates**: Strict RBAC ensuring every AI output is verified by a human expert.
- **Audit Trails**: Complete record of every action taken on a case.

## Local Development

### Prerequisites
- Docker & Docker Compose
- OpenAI API Key (or Gemini API Key with compatible wrapper)

### Setup
1. Clone the repository.
2. Create a `.env` file in the root:
   ```env
   OPENAI_API_KEY=sk-...
   DATABASE_URL=postgresql://user:password@localhost:5432/prospector
   REDIS_URL=redis://localhost:6379/0
   ```
3. Run with Docker Compose:
   ```bash
   docker-compose up --build
   ```
4. Access the app:
   - Frontend: `http://localhost:3000`
   - API Docs: `http://localhost:8000/docs`

## Railway Deployment

1. **Database**: Provision a Managed Postgres and Redis instance on Railway.
2. **Backend**: 
   - Root Directory: `backend/`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. **Worker**:
   - Build same as backend.
   - Start Command: `celery -A worker worker --loglevel=info`
4. **Frontend**:
   - Root Directory: `frontend/`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

## Default Admin Credentials
- Email: `admin@prospector.ai`
- Password: `password123`

## Environment Variables
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | SQLAlchemy connection string |
| `REDIS_URL` | Redis connection for Celery |
| `JWT_SECRET` | Secret key for token signing |
| `OPENAI_API_KEY` | Key for document extraction |
| `FRONTEND_URL` | For CORS configuration |
