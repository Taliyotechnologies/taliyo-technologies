@echo off
echo ========================================
echo    TALIYO TECHNOLOGIES - PUSH SCRIPT
echo ========================================
echo.

echo Step 1: Adding all files...
git add .
echo ✓ Files added successfully!
echo.

echo Step 2: Committing changes...
git commit -m "Update: %date% %time%"
echo ✓ Changes committed successfully!
echo.

echo Step 3: Pushing to main branch...
git push origin main
echo ✓ Pushed to main branch successfully!
echo.

echo ========================================
echo    PUSH COMPLETED SUCCESSFULLY!
echo ========================================
pause 