from fastapi import Header, HTTPException, status


async def get_current_actor(x_actor_id: str = Header(...), x_actor_role: str = Header(...)):
    if x_actor_role not in {"student", "teacher", "admin"}:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid role")
    return {"id": x_actor_id, "role": x_actor_role}

