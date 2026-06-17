from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.responses import StreamingResponse
import io
from typing import List
from app.schemas.question_schema import InterviewSetResponse
from app.middleware.auth_middleware import get_current_user
from app.services.supabase_service import DatabaseService
from app.services.pdf_service import PDFService

router = APIRouter(prefix="/history", tags=["History"])

@router.get("", response_model=List[InterviewSetResponse])
async def get_history(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    try:
        sets = await DatabaseService.get_interview_sets(user_id)
        return sets
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve history: {str(e)}"
        )

@router.get("/set/{set_id}", response_model=InterviewSetResponse)
async def get_set_details(set_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    try:
        set_details = await DatabaseService.get_interview_set_details(set_id, user_id)
        if not set_details:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Interview set not found or not owned by you"
            )
        return set_details
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve set details: {str(e)}"
        )

@router.delete("/set/{set_id}", status_code=status.HTTP_200_OK)
async def delete_set(set_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    try:
        success = await DatabaseService.delete_interview_set(set_id, user_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Interview set not found or not owned by you"
            )
        return {"detail": "Interview set deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete set: {str(e)}"
        )

@router.get("/set/{set_id}/pdf")
async def download_set_pdf(set_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    try:
        set_details = await DatabaseService.get_interview_set_details(set_id, user_id)
        if not set_details:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Interview set not found or not owned by you"
            )
            
        pdf_bytes = PDFService.generate_interview_pdf(set_details)
        
        filename = f"interview_{set_details.get('role', 'questions')}_{set_details.get('skill', '')}.pdf"
        filename = filename.replace(" ", "_").lower()
        
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={filename}"
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to export PDF: {str(e)}"
        )
