#!/bin/bash

# PitBox iOS Platform Restore Script
# Run this to restore the ios/ folder after a reboot

echo "🔄 Restoring iOS platform..."

# Check if ios folder already exists
if [ -d "ios" ]; then
  echo "⚠️  ios/ folder already exists. Remove it first? (y/n)"
  read -r response
  if [[ "$response" =~ ^[Yy]$ ]]; then
    rm -rf ios/
    echo "✓ Removed existing ios/ folder"
  else
    echo "❌ Aborted. ios/ folder not modified."
    exit 1
  fi
fi

# Extract the ios platform
if [ -f "ios-platform-backup.tar.gz" ]; then
  tar -xzf ios-platform-backup.tar.gz
  echo "✅ iOS platform restored successfully!"
  echo ""
  echo "📁 ios/ folder is now ready"
  echo ""
  echo "Next steps:"
  echo "  1. Run: npm run build"
  echo "  2. Run: npx cap sync ios"
  echo "  3. Deploy to Capawesome Cloud or open in Xcode"
else
  echo "❌ Error: ios-platform-backup.tar.gz not found"
  echo "Run 'npx cap add ios' to create a fresh iOS platform"
  exit 1
fi
