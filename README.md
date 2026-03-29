# Orbital Sense

Space weather monitoring and asset tracking system developed for TUA Hackathon.

## Overview

Orbital Sense monitors solar activity and predicts potential threats to critical infrastructure including satellites, aircraft, power grids, and data centers.

## Tech Stack

**Backend:**
- FastAPI (Python)
- SQLAlchemy
- PostgreSQL
- Machine Learning (scikit-learn)

**Frontend:**
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS

**Mobile:**
- React Native
- Expo

## Setup

### Backend

```bash
cd orbital-back
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python reset_db.py
uvicorn main:app --reload
```

Backend runs on `http://127.0.0.1:8000`

### Frontend

```bash
cd orbital-front
npm install
npm install react-simple-maps --legacy-peer-deps
npm run dev
```

Frontend runs on `http://localhost:3000`

### Mobile

```bash
cd orbital-mobile
npm install
npx expo start
```

## Features

- Real-time space weather monitoring
- AI-powered threat prediction
- Multi-asset tracking (satellites, aircraft, power grids, data centers)
- Aurora visibility forecasting
- Role-based access control (Observer, Operator, Admin)
- Push notifications for critical alerts

## API Documentation

Once the backend is running, visit `http://127.0.0.1:8000/docs` for interactive API documentation.

## Environment Variables

Create a `.env` file in `orbital-back`:

```
DATABASE_URL=sqlite:///./orbital.db
SECRET_KEY=your-secret-key-here
```

## License

MIT
