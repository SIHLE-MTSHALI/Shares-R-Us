from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from .db.session import get_db
from .api.endpoints import crypto
from fastapi.middleware.cors import CORSMiddleware
from . import crud, schemas

app = FastAPI()
app.include_router(crypto.router, prefix="/api/v1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow your frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/test-db")
def test_db(db: Session = Depends(get_db)):
    try:
        # Try to execute a simple query
        db.execute("SELECT 1")
        return {"message": "Database connection successful!"}
    except Exception as e:
        return {"error": f"Database connection failed: {str(e)}"}

@app.get("/api/v1/portfolios", response_model=list[schemas.Portfolio])
def read_portfolios(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    portfolios = crud.get_portfolios(db, skip=skip, limit=limit)
    return portfolios

@app.post("/api/v1/portfolios", response_model=schemas.Portfolio)
def create_portfolio(portfolio: schemas.PortfolioCreate, db: Session = Depends(get_db)):
    return crud.create_portfolio(db=db, portfolio=portfolio)