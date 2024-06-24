from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from .db.session import get_db

app = FastAPI()

@app.get("/test-db")
def test_db(db: Session = Depends(get_db)):
    try:
        # Try to execute a simple query
        db.execute("SELECT 1")
        return {"message": "Database connection successful!"}
    except Exception as e:
        return {"error": f"Database connection failed: {str(e)}"}
