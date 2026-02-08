@echo off
REM Security Deployment Script for Windows
REM This script deploys Firestore security rules and indexes

echo 🔒 Deploying Security Configuration...

REM Check if Firebase CLI is installed
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Firebase CLI not found. Please install it first:
    echo npm install -g firebase-tools
    pause
    exit /b 1
)

echo 📋 Deploying Firestore Security Rules...
firebase deploy --only firestore:rules

if %errorlevel% neq 0 (
    echo ❌ Failed to deploy security rules
    pause
    exit /b 1
)

echo ✅ Security rules deployed successfully!

echo 📋 Deploying Firestore Indexes...
firebase deploy --only firestore:indexes

if %errorlevel% neq 0 (
    echo ❌ Failed to deploy indexes
    pause
    exit /b 1
)

echo ✅ Indexes deployed successfully!

echo.
echo 🎉 Security configuration deployed successfully!
echo.
echo 📝 Next steps:
echo 1. Test the security rules in the Firebase Console
echo 2. Verify admin access controls
echo 3. Review the SECURITY.md file for ongoing security practices
echo.
echo 🔗 Firebase Console: https://console.firebase.google.com
pause
