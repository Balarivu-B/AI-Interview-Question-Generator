from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.question_schema import QuestionGenerateRequest, InterviewSetResponse
from app.middleware.auth_middleware import get_current_user
from app.services.openai_service import OpenAIService
from app.services.supabase_service import DatabaseService
from app.utils.validators import validate_non_empty, validate_difficulty, validate_question_type, validate_number_of_questions

router = APIRouter(prefix="/questions", tags=["Questions"])

@router.post("/generate", response_model=InterviewSetResponse)
async def generate_questions(payload: QuestionGenerateRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    
    # Validate parameters
    role = validate_non_empty(payload.role, "role")
    skill = validate_non_empty(payload.skill, "skill")
    difficulty = validate_difficulty(payload.difficulty or "Medium")
    q_type = validate_question_type(payload.question_type or "Technical")
    count = validate_number_of_questions(payload.number_of_questions or 5)
    exp_level = payload.experience_level or "Mid-Level"
    
    try:
        # Generate questions using OpenAI / fallback
        questions = await OpenAIService.generate_interview_questions(
            role=role,
            skill=skill,
            experience_level=exp_level,
            difficulty=difficulty,
            question_type=q_type,
            count=count
        )
        
        # Save interview set
        interview_set = await DatabaseService.create_interview_set(
            user_id=user_id,
            role=role,
            skill=skill,
            difficulty=difficulty,
            question_type=q_type
        )
        
        # Save individual questions
        saved_questions = await DatabaseService.save_questions(
            set_id=interview_set["id"],
            questions=questions
        )
        
        # Build response
        response_data = dict(interview_set)
        response_data["questions"] = saved_questions
        return response_data
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate questions: {str(e)}"
        )
