# PlacementIQ: AI Student Placement Predictor & Career Advisor

PlacementIQ is a production-ready, portfolio-level web application that utilizes Machine Learning to predict student placement probabilities, estimate expected salary packages, perform detailed skill gap analyses, check real-time company eligibility, and generate personalized learning roadmaps.

## 🚀 Key Features

* **AI Placement Predictor**: Predicts placement status outcomes using a Scikit-Learn Random Forest Classifier trained on academic and project parameters.
* **Salary Estimation**: Predicts expected package offers (CTC in INR LPA) using a Random Forest Regressor.
* **Explainable AI (XAI with SHAP)**: Mathematically decomposes predictions using TreeExplainer SHAP values to reveal exactly which student features pushed the probability and salary up or down, paired with an Ollama-generated natural-language explanation.
* **AI Career Mentor**: Interactive, conversational AI mentor powered by a local Ollama LLM (`qwen3:4b`), providing student-specific guidance grounded in their actual verified metrics.
* **Personalized AI Roadmap**: Synthesizes custom multi-week learning roadmaps targeting specific detected weaknesses without replacing the standard milestone checklists.
* **Real-time Company Eligibility Check**: Evaluates user profile attributes (CGPA, Backlogs, Technical Ratings) against active requirements of partner databases (Google, Stripe, Vercel, TCS, etc.), highlighting criteria gaps.
* **Premium SaaS Dashboard**: Interactive UI/UX featuring dark/light mode switches, glassmorphic cards, custom widgets, loading skeletons, and interactive radar/bar charts (powered by Recharts and Framer Motion).
* **Admin Management Console**: Allows platform administrators to manage hiring company criteria, view platform metrics (total users, prediction runs, averages), and study common technical skill deficiencies across the student directory.

---

## 🛠️ Technology Stack

* **Frontend**: React 19, Vite, Tailwind CSS v4, React Router, Axios, React Hook Form, Framer Motion, Recharts, React Icons
* **Backend**: Node.js, Express, Mongoose, JWT, bcryptjs, Helmet, CORS, Express Validator, Rate-limiter
* **Database**: MongoDB Atlas
* **Machine Learning**: Python 3.9+, Scikit-Learn, Pandas, NumPy, FastAPI, Uvicorn, Joblib

---

## 📁 Directory Structure

```text
PlacementIQ/
├── backend/
│   ├── config/          # DB connection
│   ├── controllers/     # API logic handlers (Auth, Predict, Companies, Roadmap, Analytics)
│   ├── middleware/      # Protected routes, Rate limiter, Error handler, Validation
│   ├── models/          # Mongoose Schemas (User, Prediction, Company, Roadmap, Notification)
│   ├── routes/          # Express Routers
│   ├── utils/           # Database seeder scripts
│   ├── package.json     # Node scripts & dependencies
│   └── server.js        # Main entry point
├── ml-service/
│   ├── data/            # Synthetic data generation
│   ├── train_model.py   # Model training & serialization
│   ├── predict.py       # FastAPI predictions server
│   ├── requirements.txt # Python dependencies
│   └── trained_model.pkl# Serialized Scikit-Learn models
└── frontend/
    ├── src/
    │   ├── components/  # Layout elements & common atomic components
    │   ├── context/     # React Auth & Theme Context Providers
    │   ├── pages/       # Dashboards, Predictor, Analytics, Roadmap, Admin, Profiles, etc.
    │   ├── services/    # Axios API callers
    │   ├── index.css    # Tailwind CSS v4 entry point
    │   └── App.jsx      # Navigation routers
    ├── vite.config.js   # Vite config with Tailwind plugin
    └── package.json     # Node scripts & packages
```

---

## ⚙️ Installation & Setup

### Prerequisite
Ensure you have **Node.js (v18+)**, **Python (v3.9+)**, and a running **MongoDB** instance (local or Atlas) installed.

### Step 1: Set up and Run Python ML Service
1. Navigate to the `ml-service/` folder:
   ```bash
   cd ml-service
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows (PowerShell):
   .\venv\Scripts\Activate.ps1
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Generate synthetic dataset:
   ```bash
   python data/generate_data.py
   ```
5. Train models and output `trained_model.pkl`:
   ```bash
   python train_model.py
   ```
6. Start prediction API:
   ```bash
   python predict.py
   ```
   *FastAPI server will start on [http://127.0.0.1:8000](http://127.0.0.1:8000).*

### Step 2: Set up and Run Node.js Backend
1. Navigate to the `backend/` folder:
   ```bash
   cd ../backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and configure your credentials:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://127.0.0.1:27017/placementiq  # or Atlas connection string
   JWT_SECRET=your_jwt_super_secret_key_here
   JWT_EXPIRES_IN=7d
   ML_SERVICE_URL=http://127.0.0.1:8000
   OLLAMA_BASE_URL=http://localhost:11434
   OLLAMA_MODEL=qwen3:4b
   ```
4. Ensure Ollama is running locally:
   ```bash
   # Ollama runs as a background service on http://localhost:11434
   ollama list
   ```
4. Seed the database with sample companies, skills, and admin credentials:
   ```bash
   node utils/seeder.js
   ```
   *Seeds Default User Accounts:*
   * **Student**: `student@placementiq.com` / `password123`
   * **Admin**: `admin@placementiq.com` / `password123`
5. Start Node Express dev server:
   ```bash
   npm run dev
   ```
   *Server will run on [http://localhost:5000](http://localhost:5000).*

### Step 3: Set up and Run React Frontend
1. Navigate to the `frontend/` folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Vite local development server:
   ```bash
   npm run dev
   ```
   *Vite server will start on [http://localhost:5173](http://localhost:5173).*

---

## 🎯 Verification & Testing

* **Backend Health Check**: Hit `GET http://localhost:5000/health` to confirm server status.
* **FastAPI Docs Check**: Hit `GET http://127.0.0.1:8000/health` to confirm model loading, or open [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) to view Swagger documentation.
* **Production Build Test**: Test standard static exports of React client:
  ```bash
  cd frontend
  npm run build
  ```
