#!/bin/bash

# PitBox App Icon Generator
# Creates app icons with dark black background for iOS and Android

LOGO="/tmp/cc-agent/41299875/project/public/logo.png"
OUTPUT_DIR="/tmp/cc-agent/41299875/project/app-icons"
IOS_DIR="$OUTPUT_DIR/ios"
ANDROID_DIR="$OUTPUT_DIR/android"

# Create output directories
mkdir -p "$IOS_DIR"
mkdir -p "$ANDROID_DIR"

echo "🎨 Generating PitBox App Icons..."
echo "Using logo: $LOGO"

# Function to create icon with dark background
create_icon() {
    local size=$1
    local output=$2
    local logo_size=$((size * 70 / 100))  # Logo takes 70% of the icon
    local offset=$(((size - logo_size) / 2))

    # Create dark background with subtle gradient and add logo
    convert -size ${size}x${size} \
        gradient:'#0a0a0a-#000000' \
        \( "$LOGO" -resize ${logo_size}x${logo_size} \) \
        -gravity center \
        -composite \
        \( -size ${size}x${size} radial-gradient:'rgba(212,175,55,0.08)-rgba(0,0,0,0)' \) \
        -composite \
        -quality 100 \
        "$output"

    echo "✓ Created: $output (${size}x${size})"
}

# iOS Icons
echo ""
echo "📱 Creating iOS Icons..."
create_icon 1024 "$IOS_DIR/AppIcon-1024.png"
create_icon 180 "$IOS_DIR/AppIcon-180.png"
create_icon 167 "$IOS_DIR/AppIcon-167.png"
create_icon 152 "$IOS_DIR/AppIcon-152.png"
create_icon 120 "$IOS_DIR/AppIcon-120.png"
create_icon 87 "$IOS_DIR/AppIcon-87.png"
create_icon 80 "$IOS_DIR/AppIcon-80.png"
create_icon 76 "$IOS_DIR/AppIcon-76.png"
create_icon 60 "$IOS_DIR/AppIcon-60.png"
create_icon 58 "$IOS_DIR/AppIcon-58.png"
create_icon 40 "$IOS_DIR/AppIcon-40.png"
create_icon 29 "$IOS_DIR/AppIcon-29.png"
create_icon 20 "$IOS_DIR/AppIcon-20.png"

# Android Icons
echo ""
echo "🤖 Creating Android Icons..."
create_icon 512 "$ANDROID_DIR/ic_launcher-512.png"
create_icon 192 "$ANDROID_DIR/ic_launcher-192.png"
create_icon 144 "$ANDROID_DIR/ic_launcher-144.png"
create_icon 96 "$ANDROID_DIR/ic_launcher-96.png"
create_icon 72 "$ANDROID_DIR/ic_launcher-72.png"
create_icon 48 "$ANDROID_DIR/ic_launcher-48.png"

echo ""
echo "✅ All icons generated successfully!"
echo ""
echo "📂 iOS icons: $IOS_DIR"
echo "📂 Android icons: $ANDROID_DIR"
echo ""
echo "Next steps:"
echo "1. iOS: Copy icons to ios/App/App/Assets.xcassets/AppIcon.appiconset/"
echo "2. Android: Copy icons to android/app/src/main/res/mipmap-* folders"
