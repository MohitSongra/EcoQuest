#!/bin/bash

# Security Deployment Script
# This script deploys Firestore security rules and indexes

echo "🔒 Deploying Security Configuration..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Please install it first:"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in to Firebase
if ! firebase projects:list &> /dev/null; then
    echo "❌ Not logged in to Firebase. Please run:"
    echo "firebase login"
    exit 1
fi

echo "📋 Deploying Firestore Security Rules..."
firebase deploy --only firestore:rules

if [ $? -eq 0 ]; then
    echo "✅ Security rules deployed successfully!"
else
    echo "❌ Failed to deploy security rules"
    exit 1
fi

echo "📋 Deploying Firestore Indexes..."
firebase deploy --only firestore:indexes

if [ $? -eq 0 ]; then
    echo "✅ Indexes deployed successfully!"
else
    echo "❌ Failed to deploy indexes"
    exit 1
fi

echo ""
echo "🎉 Security configuration deployed successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Test the security rules in the Firebase Console"
echo "2. Verify admin access controls"
echo "3. Review the SECURITY.md file for ongoing security practices"
echo ""
echo "🔗 Firebase Console: https://console.firebase.google.com"
