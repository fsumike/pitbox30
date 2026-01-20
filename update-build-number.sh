#!/bin/bash

# PitBox Build Number Update Script
# This script updates the build number in all required files

if [ -z "$1" ]; then
  echo "❌ Error: Please provide a build number"
  echo ""
  echo "Usage: ./update-build-number.sh <build_number>"
  echo "Example: ./update-build-number.sh 102"
  exit 1
fi

NEW_BUILD=$1

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  📱 PitBox Build Number Update                                 ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "Updating build number to: $NEW_BUILD"
echo ""

# Get current build number
CURRENT_BUILD=$(grep '"buildNumber":' capawesome.config.json | grep -o '[0-9]*')
echo "Current build number: $CURRENT_BUILD"
echo "New build number: $NEW_BUILD"
echo ""

# Update capawesome.config.json
echo "📝 Updating capawesome.config.json..."
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  sed -i '' "s/\"buildNumber\": \"$CURRENT_BUILD\"/\"buildNumber\": \"$NEW_BUILD\"/g" capawesome.config.json
else
  # Linux
  sed -i "s/\"buildNumber\": \"$CURRENT_BUILD\"/\"buildNumber\": \"$NEW_BUILD\"/g" capawesome.config.json
fi
echo "✅ Updated capawesome.config.json"

# Update iOS project.pbxproj
echo ""
echo "📝 Updating iOS Xcode project..."
if [ -f "ios/App/App.xcodeproj/project.pbxproj" ]; then
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/CURRENT_PROJECT_VERSION = $CURRENT_BUILD;/CURRENT_PROJECT_VERSION = $NEW_BUILD;/g" ios/App/App.xcodeproj/project.pbxproj
  else
    # Linux
    sed -i "s/CURRENT_PROJECT_VERSION = $CURRENT_BUILD;/CURRENT_PROJECT_VERSION = $NEW_BUILD;/g" ios/App/App.xcodeproj/project.pbxproj
  fi
  echo "✅ Updated iOS Xcode project"
else
  echo "⚠️  iOS project not found (will be created during build)"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  ✅ Build Number Update Complete!                              ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📋 Updated build number: $CURRENT_BUILD → $NEW_BUILD"
echo ""
echo "🚀 Next steps:"
echo "   1. Run: npm run capawesome:build:ios"
echo "   2. Wait 10 minutes"
echo "   3. Check App Store Connect"
echo ""
echo "💡 For next upload, run: ./update-build-number.sh $((NEW_BUILD + 1))"
echo ""
