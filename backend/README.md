# HomeHero Backend

---

## 🚀 How to Run Locally

### 1️⃣ Clone the repository (only once)
```bash
git clone <your-repo-url>

cd <your-repo-name>/backend

python -m venv venv

source venv/bin/activate       # Mac/Linux

venv\Scripts\activate          # Windows

pip install -r requirements.txt
uvicorn app.main:app --reload
```

## 📜 API Documentation
Once the server is running, API docs are available at:

Swagger UI → http://127.0.0.1:8000/docs

ReDoc → http://127.0.0.1:8000/redoc