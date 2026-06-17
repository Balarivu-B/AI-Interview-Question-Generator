from fastapi import APIRouter, Depends, HTTPException, status
import json
from app.schemas.answer_schema import AnswerEvaluationRequest, AnswerEvaluationResponse
from app.middleware.auth_middleware import get_current_user
from app.services.supabase_service import DatabaseService, supabase_client
from app.services.openai_service import client as openai_client
from app.config.settings import settings

router = APIRouter(prefix="/answers", tags=["Answers"])

@router.post("/evaluate", response_model=AnswerEvaluationResponse)
async def evaluate_answer(payload: AnswerEvaluationRequest, current_user: dict = Depends(get_current_user)):
    # 1. Fetch the question details
    question = None
    question_id = payload.question_id
    user_answer = payload.user_answer.strip()
    
    if not user_answer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User answer cannot be empty"
        )
        
    # Fetch from Supabase
    if supabase_client:
        try:
            response = supabase_client.table("questions").select("*").eq("id", question_id).execute()
            if response.data:
                question = response.data[0]
        except Exception as e:
            print(f"Supabase read error: {e}. Falling back to SQLite.")
            
    # Fetch from SQLite if not found
    if not question:
        from app.services.supabase_service import get_sqlite_conn
        conn = get_sqlite_conn()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM questions WHERE id = ?", (question_id,))
        row = cursor.fetchone()
        conn.close()
        if row:
            question = dict(row)
            
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
        
    model_answer = question["answer"]
    q_text = question["question"]
    
    # 2. Evaluate
    # Case A: OpenAI is active
    if openai_client and settings.is_openai_configured:
        try:
            prompt = f"""You are a professional technical interviewer.
Evaluate the candidate's answer for the following question.

[Question]
{q_text}

[Model Answer]
{model_answer}

[Candidate's Answer]
{user_answer}

Analyze the candidate's answer. Compare it with the model answer. Assess accuracy, clarity, and completeness.
Output your evaluation in JSON format with two keys:
1. "score": An integer between 1 and 10 (10 being perfect, 1 being completely irrelevant or incorrect).
2. "feedback": A 2-3 sentence explanation summarizing what they got right, what was missing, and how to improve.

Output only valid JSON. Do not include markdown formatting, backticks, or other text.
"""
            response = openai_client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": "You are a professional technical interviewer who evaluates answers in JSON format."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3
            )
            
            result = json.loads(response.choices[0].message.content)
            return {
                "score": int(result.get("score", 5)),
                "feedback": result.get("feedback", "Good attempt. Practice matches with model answer to improve."),
                "model_answer": model_answer
            }
        except Exception as e:
            print(f"OpenAI evaluation failed: {e}. Falling back to rule-based.")
            
    # Case B: Local Rule-based Evaluation (Mock)
    # Simple length and overlap evaluation
    words_user = set(user_answer.lower().split())
    words_model = set(model_answer.lower().split())
    
    overlap = len(words_user.intersection(words_model))
    
    # Give basic score
    if len(user_answer) < 10:
        score = 2
        feedback = "Your answer is too short. Please provide a more detailed explanation covering the core concepts."
    elif overlap > 15:
        score = 8
        feedback = "Great job! You used several key technical terms and concepts that align with the model answer."
    elif overlap > 8:
        score = 6
        feedback = "Good response. You cover some basic concepts, but you can expand on implementation details or edge cases shown in the model answer."
    else:
        score = 4
        feedback = "Your answer touches on the topic, but lacks core details or technical terms. Review the model answer to refine your understanding."
        
    return {
        "score": score,
        "feedback": feedback,
        "model_answer": model_answer
    }
