from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    frontend_origin: str = "http://localhost:3000"
    ml_service_port: int = 8001

    class Config:
        env_file = ".env"


settings = Settings()