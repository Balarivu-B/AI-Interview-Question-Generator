import re
from fastapi import HTTPException, status

def validate_non_empty(value: str, field_name: str) -> str:
    cleaned = value.strip()
    if not cleaned:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Field '{field_name}' cannot be empty or only whitespace."
        )
    return cleaned

def validate_number_of_questions(count: int) -> int:
    if count < 1 or count > 15:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Number of questions must be between 1 and 15."
        )
    return count

def validate_difficulty(level: str) -> str:
    valid_levels = {"Easy", "Medium", "Hard"}
    cleaned = level.strip().capitalize()
    if cleaned not in valid_levels:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid difficulty '{level}'. Must be one of Easy, Medium, Hard."
        )
    return cleaned

def validate_question_type(q_type: str) -> str:
    valid_types = {"Technical", "Behavioral", "Situational", "HR", "Mixed"}
    cleaned = q_type.strip().capitalize()
    if cleaned not in valid_types:
        # Check if they sent "mixed" in lower/title
        if cleaned == "Mixed" or cleaned == "Hr":
            if cleaned == "Hr":
                return "HR"
            return cleaned
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid question type '{q_type}'. Must be one of Technical, Behavioral, Situational, HR, Mixed."
        )
    return cleaned
