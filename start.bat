@echo off
echo ========================================
echo   Symmetra - LaTeX Note Taking App
echo ========================================
echo.

REM Check if node_modules exists
if not exist node_modules (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting Symmetra...
echo.

npm start

