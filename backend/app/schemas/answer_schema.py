from pydantic import BaseModel

class AnswerEvaluationRequest(BaseModel):
    question_id: str
    user_answer: str

class AnswerEvaluationResponse(BaseModel):
    score: int
    feedback: str
    model_answer: str
