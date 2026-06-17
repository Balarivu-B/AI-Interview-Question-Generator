import json
import logging
from typing import List, Dict, Any
from app.config.settings import settings
from app.services.prompt_service import PromptService
from app.utils.helpers import generate_mock_questions

logger = logging.getLogger("app.openai_service")

# Initialize client
client = None
if settings.is_openai_configured:
    try:
        from openai import OpenAI
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
    except Exception as e:
        logger.warning(f"Failed to initialize OpenAI client: {e}")
        client = None

class OpenAIService:
    @staticmethod
    async def generate_interview_questions(
        role: str,
        skill: str,
        experience_level: str,
        difficulty: str,
        question_type: str,
        count: int
    ) -> List[Dict[str, Any]]:
        """
        Generate questions, answers, and hints.
        Uses OpenAI if configured, otherwise falls back to realistic mock questions.
        """
        if not client or not settings.is_openai_configured:
            logger.info("OpenAI API Key not configured. Using high-quality mock fallback generator.")
            return generate_mock_questions(role, skill, difficulty, question_type, count)
            
        prompt = PromptService.get_generation_prompt(
            role=role,
            skill=skill,
            experience_level=experience_level,
            difficulty=difficulty,
            question_type=question_type,
            count=count
        )
        
        try:
            # We use chat completions with JSON mode
            response = client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                response_format={"type": "json_object"},
                messages=[
                    {
                        "role": "system", 
                        "content": "You are a professional hiring manager and interview preparation system that outputs JSON."
                    },
                    {
                        "role": "user", 
                        "content": prompt
                    }
                ],
                temperature=0.7
            )
            
            content = response.choices[0].message.content
            data = json.loads(content)
            
            # Extract list from "questions" key
            if isinstance(data, dict) and "questions" in data:
                questions = data["questions"]
            elif isinstance(data, list):
                questions = data
            else:
                raise ValueError("Unexpected JSON response structure from OpenAI.")
                
            # If questions list is empty or invalid, fallback
            if not questions or not isinstance(questions, list):
                raise ValueError("JSON parsed successfully but questions list was empty or invalid.")
                
            # Ensure each question has a unique ID and is structured
            formatted_questions = []
            import uuid
            for q in questions:
                # Basic validation
                q_text = q.get("question") or "Explain concepts of the technology."
                q_ans = q.get("answer") or "No answer details provided."
                q_hint = q.get("hint") or "Try focusing on core concepts."
                q_diff = q.get("difficulty") or difficulty
                
                formatted_questions.append({
                    "id": str(uuid.uuid4()),
                    "question": q_text,
                    "answer": q_ans,
                    "hint": q_hint,
                    "difficulty": q_diff
                })
                
            # Ensure we generated the requested count
            if len(formatted_questions) < count:
                # Pad with some mock ones
                padding = generate_mock_questions(role, skill, difficulty, question_type, count - len(formatted_questions))
                formatted_questions.extend(padding)
                
            return formatted_questions[:count]
            
        except Exception as e:
            logger.error(f"Error calling OpenAI API: {e}. Falling back to mock generator.")
            return generate_mock_questions(role, skill, difficulty, question_type, count)
