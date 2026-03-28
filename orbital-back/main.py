from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routers import auth, telemetry

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="OrbitalSense API",
    description="Mission Control Backend for OrbitalSense",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(telemetry.router, prefix="/telemetry", tags=["Telemetry"])


@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "service": "OrbitalSense API"}
