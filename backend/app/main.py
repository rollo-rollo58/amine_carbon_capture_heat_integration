"""FastAPI ASGI application and research WebSocket endpoint."""
import asyncio

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import PlainTextResponse
from fastapi.middleware.cors import CORSMiddleware

from .config import load_settings
from .routes import router
from .repository import meter
from .telemetry import sample

settings = load_settings()
app = FastAPI(title="CarbonLoop Research API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=list(settings.origins),
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)
app.include_router(router)


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "environment": settings.app_env, "simulated": True}


@app.websocket("/ws/telemetry")
async def telemetry_socket(socket: WebSocket) -> None:
    await socket.accept()
    try:
        while True:
            await socket.send_json(sample())
            await asyncio.sleep(1.0)
    except (WebSocketDisconnect, RuntimeError):
        return


@app.get("/metrics", response_class=PlainTextResponse)
def metrics() -> str:
    counts = meter.snapshot()
    rows = ["# TYPE carbonloop_requests_total counter"]
    for name, value in sorted(counts.items()):
        if name.replace("_", "").isalnum():
            rows.append(f'carbonloop_requests_total{{operation="{name}"}} {value}')
    return "\n".join(rows) + "\n"
