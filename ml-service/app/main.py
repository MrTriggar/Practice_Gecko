from fastapi import FastAPI

from .routes import router

app = FastAPI(
    title="Gecko ML service",
    description="Терминологический модуль и AI-помощник (mock) для Practice_Gecko",
)

app.include_router(router)