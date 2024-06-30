import sys
import os
from pathlib import Path

# Add the parent directory of 'run.py' to the Python path
current_dir = Path(__file__).resolve().parent
parent_dir = current_dir.parent
sys.path.append(str(parent_dir))

import uvicorn
from backend.app.main import app  # Updated import statement

if __name__ == "__main__":
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)