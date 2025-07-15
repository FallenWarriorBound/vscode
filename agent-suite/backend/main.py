from fastapi import FastAPI, WebSocket, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, create_engine, Session, select
from pydantic import BaseModel
from typing import List

app = FastAPI(title="ExploreGPT Agent Suite", version="0.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# in-memory sqlite for demo
engine = create_engine("sqlite:///./agents.db", echo=True)

class AgentBase(SQLModel):
    name: str
    role: str

from sqlmodel import Field

class Agent(AgentBase, table=True):
    id: int | None = Field(default=None, primary_key=True)

SQLModel.metadata.create_all(engine)

class AgentCreate(AgentBase):
    pass

@app.post("/agents", response_model=Agent)
def register_agent(agent: AgentCreate):
    with Session(engine) as session:
        db_agent = Agent.from_orm(agent)
        session.add(db_agent)
        session.commit()
        session.refresh(db_agent)
        return db_agent

@app.get("/agents", response_model=List[Agent])
def list_agents():
    with Session(engine) as session:
        agents = session.exec(select(Agent)).all()
        return agents

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    await ws.send_text("Agent suite websocket connected.")
    await ws.close()
