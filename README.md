# Gecko ML Service

ML-service для Practice_Gecko.
Сервис реализует:

- терминологический модуль;
- mock AI-подсказки для сегментов;
- FastAPI API для интеграции с backend/frontend.

## Endpoints

### POST /check_terms

Проверка терминов в тексте.

Request:
```json
{
  "text": "ЯДРО и API"
}
```

Response:
```json
{
  "terms": [
    {
      "term": "ЯДРО",
      "status": "wrong",
      "suggestion": "YADRO",
      "category": "brand"
    },
    {
      "term": "API",
      "status": "approved",
      "suggestion": null,
      "category": "tech"
    }
  ]
}
```

### POST /suggest_fix

Mock AI-проверка сегментов.

Request:
```json
{
  "segments": [
    { "id": 1, "text": "Короткий сегмент" },
    { "id": 2, "text": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" }
  ]
}
```

Response:
```json
{
  "issues": [
    {
      "segment_id": 2,
      "issue": "Возможно, обрезано слово",
      "severity": "high"
    }
  ]
}
```

## Local run

```bash
source .venv/bin/activate
pip install -r app/requirements.txt
uvicorn ml-service.app.main:app --reload --port 8001
```

Swagger:
`http://127.0.0.1:8001/docs`

## Tests

```bash
pytest ml-service/app/test_main.py -v
```

## Docker

Build:
```bash
docker build -t gecko-ml-service -f ml-service/Dockerfile ml-service
```

Run:
```bash
docker run -p 8001:8001 gecko-ml-service
```

## Config

`.env`:
```env
FRONTEND_ORIGIN=http://localhost:3000
ML_SERVICE_PORT=8001
```

## Terms dictionary

Термины лежат в:
`ml-service/app/terms.json`