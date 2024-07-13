import sys
import os
from pathlib import Path

# Add the parent directory of 'backend' to the Python path
current_dir = Path(__file__).resolve().parent
backend_dir = current_dir / "backend"
sys.path.append(str(backend_dir))

from app.main import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)