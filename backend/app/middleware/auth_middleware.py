from fastapi import Request, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.config.settings import settings
from app.utils.helpers import decode_access_token
from app.services.supabase_service import supabase_client, DatabaseService

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    Validate the authentication token from request header.
    Resolves to a user dictionary with 'id' and 'email'.
    """
    token = credentials.credentials
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication token"
        )
        
    # Case 1: Supabase mode
    if supabase_client:
        try:
            # We call get_user on supabase client to verify the JWT
            response = supabase_client.auth.get_user(token)
            if response and response.user:
                return {
                    "id": response.user.id,
                    "email": response.user.email
                }
        except Exception as e:
            # Check if token is locally generated (could be developer switching modes)
            pass
            
    # Case 2: Local JWT / fallback mode
    payload = decode_access_token(token)
    if payload and "sub" in payload:
        # sub contains the user_id, email is in payload
        user_id = payload.get("sub")
        email = payload.get("email")
        
        # Verify user still exists in SQLite
        user = DatabaseService.get_local_user_by_id(user_id)
        if user:
            return {
                "id": user["id"],
                "email": user["email"]
            }
            
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token"
    )
