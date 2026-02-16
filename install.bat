@echo off
echo ========================================
echo Task Management System - Installation
echo ========================================
echo.

:: Check Node.js
echo [1/6] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js found!
node --version
echo.

:: Check MongoDB
echo [2/6] Checking MongoDB...
mongosh --version >nul 2>&1
if errorlevel 1 (
    echo WARNING: MongoDB CLI not found!
    echo Please ensure MongoDB is installed and running
    echo Download from: https://www.mongodb.com/try/download/community
    echo.
)
echo.

:: Install Backend Dependencies
echo [3/6] Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies!
    pause
    exit /b 1
)
echo Backend dependencies installed successfully!
echo.

:: Install Frontend Dependencies
echo [4/6] Installing frontend dependencies...
cd ..\frontend
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies!
    pause
    exit /b 1
)
echo Frontend dependencies installed successfully!
echo.

:: Check Environment File
echo [5/6] Checking environment configuration...
cd ..\backend
if not exist .env (
    echo WARNING: .env file not found!
    echo Creating .env from .env.example...
    copy .env.example .env
    echo.
    echo IMPORTANT: Please edit backend\.env file with your settings:
    echo   - MongoDB URI
    echo   - JWT Secret
    echo   - Email credentials
    echo.
    pause
)
echo.

:: Initialize Database
echo [6/6] Do you want to initialize the database? (Y/N)
set /p INIT_DB=
if /i "%INIT_DB%"=="Y" (
    echo Initializing database...
    call npm run init-db
    if errorlevel 1 (
        echo ERROR: Failed to initialize database!
        echo Please check your MongoDB connection and .env file
        pause
        exit /b 1
    )
    echo Database initialized successfully!
    echo.
)

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Edit backend\.env with your email credentials
echo 2. Start MongoDB (if not running)
echo 3. Run start.bat to start the application
echo.
echo Test Accounts:
echo   Admin: admin@taskmanagement.com / Admin@123
echo   User: john@example.com / User@123
echo.
pause
