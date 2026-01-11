#!/bin/bash

# Function to kill background processes on exit
cleanup() {
    echo "🛑 Stopping all services..."
    kill $(jobs -p) 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

echo "🏥 Starting C.A.R.E. System..."

# 1. Start Backend
echo "🚀 Starting EMR Backend (Port 8000)..."
cd emr_platform/backend
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
cd ../..

# Wait for Backend to be ready before seeding
echo "⏳ Waiting for Backend to initialize..."
sleep 5

# 2. Seed Data
echo "🌱 Seeding Database with Mock Data..."
python3 seed_data.py

# 3. Start Frontend
echo "💻 Starting Frontend (Port 5173)..."
cd emr_platform/frontend
npm run dev -- --host &
FRONTEND_PID=$!
cd ../..

# 4. Start Dashboard
echo "📊 Starting Doctor's Dashboard (Port 8501)..."
streamlit run dashboard/app.py &
DASHBOARD_PID=$!

# 5. Start Hardware Gateway
echo "🔌 Starting Hardware Gateway..."
python3 gateway/service.py &
GATEWAY_PID=$!

echo "==================================================="
echo "✅ SYSTEM LIVE!"
echo "   - Backend:   http://localhost:8000"
echo "   - Frontend:  http://localhost:5173"
echo "   - Dashboard: http://localhost:8501"
echo "   - Gateway:   Active (Logs in terminal)"
echo ""
echo "⚠️  REMINDER: Make sure Ganache is running on Port 7545!"
echo "==================================================="

# Keep script running to maintain background processes
wait
