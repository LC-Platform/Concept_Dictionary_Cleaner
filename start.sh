#!/bin/bash

# Step 1: Pull latest code
echo "🔄 Pulling latest changes from Git..."
git pull

# Step 2: Frontend setup and start
echo "📦 Installing frontend dependencies..."
cd dictionary_cleaner
npm install

echo "🚀 Starting frontend..."
npm start &
FRONTEND_PID=$!
cd ..

# Info
echo "✅ Frontend  started."
echo "Frontend PID: $FRONTEND_PID"

# Optional: Wait for both to finish (if needed)
wait $FRONTEND_PID 
