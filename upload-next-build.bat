@echo off
echo.
echo ============================================
echo   Incrementing Build Number and Uploading
echo ============================================
echo.

npm run build-ios-next

echo.
echo ============================================
echo   Upload Complete!
echo ============================================
echo.
echo Check App Store Connect in 5-10 minutes:
echo https://appstoreconnect.apple.com/apps/6757286830/testflight
echo.
pause
