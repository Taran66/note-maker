from pydantic import BaseModel
from typing import Optional

class Note(BaseModel):
    id: Optional[str] = None
    title: str
    content: str
