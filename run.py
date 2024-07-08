import sys
import os
from pathlib import Path

# Add the parent directory of 'backend' to the Python path
current_dir = Path(__file__).resolve().parent
backend_dir = current_dir / "backend"
sys.path.append(str(backend_dir))

import uvicorn
from backend.app.main import app  # Ensure this import is correct

if __name__ == "__main__":
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
