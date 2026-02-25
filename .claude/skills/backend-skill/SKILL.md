---
name: backend-skill
description: Generate routes, handle requests and responses, and connect to databases for backend applications.
---

# Backend Skill

## Instructions

1. **Route Generation**
   - Create RESTful or GraphQL endpoints
   - Use proper HTTP methods (GET, POST, PUT, DELETE)
   - Structure routes logically by resource
   - Version APIs for maintainability

2. **Request & Response Handling**
   - Validate incoming requests using schemas (Pydantic, Joi, or similar)
   - Sanitize and normalize user input
   - Send structured and consistent responses
   - Handle errors gracefully and securely

3. **Database Connection**
   - Connect to databases securely (PostgreSQL, MySQL, MongoDB, etc.)
   - Implement CRUD operations efficiently
   - Use async drivers where supported
   - Manage connection pooling and transactions safely

4. **Middleware & Dependencies**
   - Implement authentication, logging, and validation middleware
   - Manage dependencies for scalable services
   - Handle caching and rate limiting where needed

---

## Best Practices

- Keep routes modular and maintainable  
- Use clear and consistent response formats  
- Validate all inputs and outputs  
- Protect sensitive endpoints with authentication  
- Write reusable and testable backend code  
- Handle errors without leaking sensitive information  
- Document endpoints with OpenAPI/Swagger  

---

## Example Structure

```python
from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from database import get_db, User

app = FastAPI()

class UserCreate(BaseModel):
    email: str
    password: str

@app.post("/users")
async def create_user(user: UserCreate, db=Depends(get_db)):
    hashed_password = hash_password(user.password)
    db_user = User(email=user.email, password_hash=hashed_password)
    db.add(db_user)
    db.commit()
    return {"id": db_user.id, "email": db_user.email}
