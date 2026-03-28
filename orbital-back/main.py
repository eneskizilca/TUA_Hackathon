from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routers import auth, telemetry


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        Base.metadata.create_all(bind=engine)
        print("✓ Database tables ready")
    except Exception as e:
        print(f"⚠ DB not reachable at startup: {e}")
    yield


app = FastAPI(
    title="OrbitalSense API",
    description="Mission Control Backend for OrbitalSense",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(telemetry.router, prefix="/api/v1/telemetry", tags=["Telemetry"])


@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "service": "OrbitalSense API", "version": "0.1.0"}
