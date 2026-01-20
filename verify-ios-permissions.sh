#!/bin/bash

echo "🔍 Verifying iOS App Store Permissions Setup..."
echo ""

# Check if Info.plist exists
if [ -f "ios/App/App/Info.plist" ]; then
    echo "✅ Info.plist exists at ios/App/App/Info.plist"
else
    echo "❌ Info.plist NOT found! Run: npm run build:ios"
    exit 1
fi

# Check required permissions
echo ""
echo "📋 Checking REQUIRED permissions:"

if grep -q "NSPhotoLibraryUsageDescription" ios/App/App/Info.plist; then
    echo "  ✅ NSPhotoLibraryUsageDescription (REQUIRED)"
else
    echo "  ❌ NSPhotoLibraryUsageDescription MISSING!"
    exit 1
fi

if grep -q "NSLocationWhenInUseUsageDescription" ios/App/App/Info.plist; then
    echo "  ✅ NSLocationWhenInUseUsageDescription (WARNING)"
else
    echo "  ❌ NSLocationWhenInUseUsageDescription MISSING!"
    exit 1
fi

# Check additional permissions
echo ""
echo "📋 Checking ADDITIONAL permissions:"
permissions=(
    "NSCameraUsageDescription"
    "NSPhotoLibraryAddUsageDescription"
    "NSLocationAlwaysUsageDescription"
    "NSMicrophoneUsageDescription"
    "NSMotionUsageDescription"
    "NSBluetoothAlwaysUsageDescription"
    "NSFaceIDUsageDescription"
)

for perm in "${permissions[@]}"; do
    if grep -q "$perm" ios/App/App/Info.plist; then
        echo "  ✅ $perm"
    else
        echo "  ⚠️  $perm missing (optional)"
    fi
done

# Check Bundle ID
echo ""
echo "📦 Checking Bundle ID:"
if grep -q 'appId.*com\.pitbox\.app' capacitor.config.ts; then
    echo "  ✅ Bundle ID: com.pitbox.app"
else
    echo "  ❌ Bundle ID incorrect! Should be com.pitbox.app"
    exit 1
fi

# Check .gitignore
echo ""
echo "📁 Checking .gitignore:"
if grep -q '!ios/App/App/Info.plist' .gitignore; then
    echo "  ✅ Info.plist is tracked in git"
else
    echo "  ❌ Info.plist is ignored! It won't be committed to git"
    echo "     Add this line to .gitignore: !ios/App/App/Info.plist"
    exit 1
fi

echo ""
echo "🎉 All checks passed! Your iOS app is ready for App Store submission."
echo ""
echo "Next steps:"
echo "  1. Commit the ios/App/App/Info.plist file:"
echo "     git add ios/App/App/Info.plist .gitignore"
echo "     git commit -m 'Fix: Add iOS permissions for App Store'"
echo ""
echo "  2. Push to repository:"
echo "     git push origin main"
echo ""
echo "  3. Build with Capawesome:"
echo "     npm run capawesome:build:ios"
echo ""
echo "  4. Upload to App Store Connect"
echo ""
