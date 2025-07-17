from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
import json
import os

app = FastAPI(title="Agent Suite API", version="1.0.0")

@app.get("/ping")
def ping():
    return {"ping": "pong"}

if __name__ == "__main__":
    schema = get_openapi(title=app.title, version=app.version, routes=app.routes)
    out_path = os.path.join(os.path.dirname(__file__), "api_docs.json")
    with open(out_path, "w") as f:
        json.dump(schema, f, indent=2)
    print(f"OpenAPI spec written to {out_path}")
