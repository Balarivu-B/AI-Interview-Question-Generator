from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class QuestionGenerateRequest(BaseModel):
    role: str = Field(..., description="Job role, e.g. Software Engineer")
    skill: str = Field(..., description="Core skill, e.g. Python")
    experience_level: Optional[str] = Field("Mid-Level", description="Experience level, e.g. Entry, Mid-Level, Senior")
    difficulty: Optional[str] = Field("Medium", description="Difficulty level, e.g. Easy, Medium, Hard")
    question_type: Optional[str] = Field("Technical", description="Type of questions, e.g. Technical, Behavioral, Situational, HR, Mixed")
    number_of_questions: Optional[int] = Field(5, ge=1, le=15, description="Number of questions to generate")

class QuestionBaseSchema(BaseModel):
    question: str
    answer: str
    hint: str
    difficulty: str

class QuestionResponse(QuestionBaseSchema):
    id: str
    set_id: str

class InterviewSetResponse(BaseModel):
    id: str
    user_id: str
    role: str
    skill: str
    difficulty: str
    question_type: str
    created_at: datetime
    questions: Optional[List[QuestionResponse]] = None

    class Config:
        from_attributes = True
