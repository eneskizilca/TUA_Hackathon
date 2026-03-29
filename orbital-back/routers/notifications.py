from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from exponent_server_sdk import (
    PushClient,
    PushMessage,
    PushServerError,
)

from database import get_db
from models import PushToken, User
from routers.auth import get_current_user

router = APIRouter()

class PushTokenCreate(BaseModel):
    expo_token: str

class BroadcastPayload(BaseModel):
    message: str
    kp_value: float
    threat_score: float

@router.post("/register")
def register_push_token(
    payload: PushTokenCreate,
    db: Session = Depends(get_db)
):
    # Hackathon override: Fetch first available user to attach the token to
    first_user = db.query(User).first()
    user_id = first_user.id if first_user else None

    existing = db.query(PushToken).filter(PushToken.expo_token == payload.expo_token).first()
    if existing:
        if user_id and existing.user_id != user_id:
            existing.user_id = user_id
            db.commit()
        return {"status": "ok", "message": "Token already registered"}

    new_token = PushToken(
        expo_token=payload.expo_token,
        user_id=user_id
    )
    db.add(new_token)
    db.commit()
    return {"status": "ok", "message": "Token registered"}


@router.post("/test")
def test_push_notifications(db: Session = Depends(get_db)):
    tokens = db.query(PushToken).all()
    if not tokens:
        return {"status": "ok", "message": "No tokens registered"}

    messages = [
        PushMessage(
            to=t.expo_token,
            body="⚠️ SOLAR ALERT - Kp threshold exceeded",
            data={"type": "alert"}
        )
        for t in tokens
    ]

    try:
        PushClient().publish_multiple(messages)
    except PushServerError as exc:
        raise HTTPException(status_code=500, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

    return {"status": "ok", "sent": len(messages)}


@router.post("/broadcast")
def broadcast_alert(payload: BroadcastPayload, db: Session = Depends(get_db)):
    tokens = db.query(PushToken).all()
    if not tokens:
        return {"status": "ok", "message": "No tokens registered"}

    messages = [
        PushMessage(
            to=t.expo_token,
            title="⚠️ ORBITAL SENSE SOLAR ALERT",
            body=f"INCOMING CME — Kp: {payload.kp_value} | Threat: {payload.threat_score}% | Satellites at risk",
            data={"type": "alert", "message": payload.message}
        )
        for t in tokens
    ]

    try:
        PushClient().publish_multiple(messages)
    except PushServerError as exc:
        raise HTTPException(status_code=500, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

    return {"status": "ok", "sent": len(messages)}
