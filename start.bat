@echo off
echo ========================================
echo Task Management System - Starting
echo ========================================
echo.

:: Check if MongoDB is running
echo Checking MongoDB connection...
mongosh --eval "db.version()" >nul 2>&1
if errorlevel 1 (
    echo WARNING: Cannot connect to MongoDB!
    echo Please start MongoDB service:
    echo   net start MongoDB
    echo.
    pause
)

echo Starting Backend Server...
echo.
start "Task Management - Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
echo.
start "Task Management - Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo Servers Starting...
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to open the application in browser...
pause >nul

start http://localhost:5173

echo.
echo Application opened in browser!
echo.
echo To stop the servers, close the terminal windows.
echo.
