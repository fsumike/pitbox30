#!/bin/bash

###############################################
# PIT-BOX Android Build Helper Script
###############################################
#
# This script automates the Android build process
# for the PIT-BOX Capacitor app.
#
# Usage: ./android-build.sh [command]
#
# Commands:
#   setup    - First time Android setup
#   build    - Build and sync (most common)
#   open     - Open in Android Studio
#   clean    - Clean build files
#   help     - Show this help message
#
###############################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check if node_modules exists
check_dependencies() {
    if [ ! -d "node_modules" ]; then
        print_error "node_modules not found!"
        print_info "Run: npm install"
        exit 1
    fi
}

# Build web app
build_web() {
    print_header "Building Web App"

    if npm run build; then
        print_success "Web app built successfully"
    else
        print_error "Web app build failed"
        exit 1
    fi
}

# Setup Android for first time
setup_android() {
    print_header "Setting Up Android (First Time)"

    check_dependencies

    # Check if android folder exists
    if [ -d "android" ]; then
        print_warning "Android folder already exists"
        read -p "Do you want to remove it and start fresh? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_info "Removing existing android folder..."
            rm -rf android
        else
            print_info "Keeping existing android folder"
            return 0
        fi
    fi

    # Build web app first
    build_web

    # Add Android platform
    print_info "Adding Android platform..."
    if npx cap add android; then
        print_success "Android platform added"
    else
        print_error "Failed to add Android platform"
        exit 1
    fi

    # Initial sync
    print_info "Syncing for the first time..."
    if npx cap sync android; then
        print_success "Initial sync complete"
    else
        print_error "Sync failed"
        exit 1
    fi

    print_success "Android setup complete!"
    print_info "Next step: Run './android-build.sh open' to open in Android Studio"
}

# Build and sync
build_and_sync() {
    print_header "Building and Syncing Android"

    # Check if android folder exists
    if [ ! -d "android" ]; then
        print_error "Android folder not found!"
        print_info "Run: ./android-build.sh setup"
        exit 1
    fi

    check_dependencies

    # Build web app
    build_web

    # Sync to Android
    print_info "Syncing to Android..."
    if npx cap sync android; then
        print_success "Synced successfully"
    else
        print_error "Sync failed"
        exit 1
    fi

    print_success "Build complete!"
    print_info "APK location: android/app/build/outputs/apk/debug/app-debug.apk"
    print_info "Next step: Open Android Studio and build APK"
    print_info "Run: ./android-build.sh open"
}

# Open in Android Studio
open_android_studio() {
    print_header "Opening Android Studio"

    if [ ! -d "android" ]; then
        print_error "Android folder not found!"
        print_info "Run: ./android-build.sh setup"
        exit 1
    fi

    if npx cap open android; then
        print_success "Android Studio opened"
    else
        print_error "Failed to open Android Studio"
        print_info "Try opening manually: File → Open → Select 'android' folder"
        exit 1
    fi
}

# Clean build files
clean_build() {
    print_header "Cleaning Build Files"

    print_info "Cleaning dist folder..."
    rm -rf dist
    print_success "dist/ cleaned"

    if [ -d "android" ]; then
        print_info "Cleaning Android build folder..."
        rm -rf android/app/build
        print_success "android/app/build/ cleaned"

        print_info "Cleaning Gradle cache..."
        cd android
        if command -v ./gradlew &> /dev/null; then
            ./gradlew clean
            print_success "Gradle cleaned"
        else
            print_warning "Gradle wrapper not found, skipping Gradle clean"
        fi
        cd ..
    fi

    print_success "Clean complete!"
    print_info "Run './android-build.sh build' to rebuild"
}

# Show help
show_help() {
    echo ""
    echo "PIT-BOX Android Build Helper"
    echo ""
    echo "Usage: ./android-build.sh [command]"
    echo ""
    echo "Commands:"
    echo "  setup    - First time Android setup (adds Android platform)"
    echo "  build    - Build web app and sync to Android (use this most often)"
    echo "  open     - Open project in Android Studio"
    echo "  clean    - Clean build files (dist, android/build, Gradle cache)"
    echo "  help     - Show this help message"
    echo ""
    echo "Typical workflow:"
    echo "  1. First time: ./android-build.sh setup"
    echo "  2. Every change: ./android-build.sh build"
    echo "  3. Then: ./android-build.sh open"
    echo "  4. In Android Studio: Build → Build APK"
    echo ""
    echo "Quick build: ./android-build.sh build && ./android-build.sh open"
    echo ""
}

# Main script
main() {
    # Check if we're in the project root
    if [ ! -f "capacitor.config.ts" ]; then
        print_error "Not in project root directory!"
        print_info "Run this script from the project root folder"
        exit 1
    fi

    # Parse command
    case "$1" in
        setup)
            setup_android
            ;;
        build)
            build_and_sync
            ;;
        open)
            open_android_studio
            ;;
        clean)
            clean_build
            ;;
        help|--help|-h|"")
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
