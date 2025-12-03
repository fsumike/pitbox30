#!/bin/bash

###############################################
# PIT-BOX Android Build Helper Script
# Complete Version with Enhanced Features
###############################################
#
# This script automates the Android build process
# for the PIT-BOX Capacitor app.
#
# Usage: ./android-build.sh [command]
#
# Commands:
#   setup       - First time Android setup
#   build       - Build and sync (most common)
#   open        - Open in Android Studio
#   clean       - Clean build files
#   full-clean  - Deep clean (removes android folder)
#   version     - Check versions of tools
#   help        - Show this help message
#
###############################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
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
    echo -e "${CYAN}ℹ $1${NC}"
}

print_step() {
    echo -e "${MAGENTA}▶ $1${NC}"
}

# Check if node_modules exists
check_dependencies() {
    print_step "Checking dependencies..."
    if [ ! -d "node_modules" ]; then
        print_error "node_modules not found!"
        print_info "Run: npm install"
        exit 1
    fi
    print_success "Dependencies found"
}

# Check if required tools are installed
check_tools() {
    print_step "Checking required tools..."

    if ! command -v node &> /dev/null; then
        print_error "Node.js not found!"
        print_info "Install from: https://nodejs.org/"
        exit 1
    fi
    print_success "Node.js found: $(node --version)"

    if ! command -v npm &> /dev/null; then
        print_error "npm not found!"
        print_info "Install Node.js from: https://nodejs.org/"
        exit 1
    fi
    print_success "npm found: $(npm --version)"

    if ! command -v npx &> /dev/null; then
        print_error "npx not found!"
        print_info "Update npm: npm install -g npm@latest"
        exit 1
    fi
    print_success "npx found"
}

# Build web app
build_web() {
    print_header "Building Web App"

    print_step "Running npm run build..."
    if npm run build; then
        print_success "Web app built successfully"

        # Check if dist folder was created
        if [ -d "dist" ]; then
            DIST_SIZE=$(du -sh dist | cut -f1)
            print_info "Build output size: $DIST_SIZE"
        else
            print_error "dist folder not created!"
            exit 1
        fi
    else
        print_error "Web app build failed"
        print_info "Check the error messages above"
        exit 1
    fi
}

# Setup Android for first time
setup_android() {
    print_header "Setting Up Android (First Time)"

    check_tools
    check_dependencies

    # Check if android folder exists
    if [ -d "android" ]; then
        print_warning "Android folder already exists"
        read -p "Do you want to remove it and start fresh? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_step "Removing existing android folder..."
            rm -rf android
            print_success "Removed android folder"
        else
            print_info "Keeping existing android folder"
            print_info "Proceeding with sync only..."
            build_web
            sync_android
            return 0
        fi
    fi

    # Build web app first
    build_web

    # Add Android platform
    print_header "Adding Android Platform"
    print_step "Running: npx cap add android"
    print_warning "This may take 10-30 seconds..."

    if npx cap add android; then
        print_success "Android platform added"
    else
        print_error "Failed to add Android platform"
        print_info "Make sure capacitor.config.ts exists"
        exit 1
    fi

    # Initial sync
    print_header "Initial Sync"
    print_step "Running: npx cap sync android"

    if npx cap sync android; then
        print_success "Initial sync complete"
    else
        print_error "Sync failed"
        exit 1
    fi

    print_header "Setup Complete!"
    print_success "Android project is ready!"
    print_info ""
    print_info "Next steps:"
    print_info "  1. Run: ./android-build.sh open"
    print_info "  2. Wait for Android Studio to finish indexing"
    print_info "  3. Update Gradle version to 8.5 (see guide)"
    print_info "  4. Build → Build APK"
    print_info ""
}

# Sync to Android
sync_android() {
    print_header "Syncing to Android"

    print_step "Running: npx cap sync android"

    if npx cap sync android; then
        print_success "Synced successfully"
    else
        print_error "Sync failed"
        exit 1
    fi
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
    sync_android

    print_header "Build Complete!"
    print_success "Your app is ready to build in Android Studio"
    print_info ""
    print_info "APK locations:"
    print_info "  Debug:   android/app/build/outputs/apk/debug/app-debug.apk"
    print_info "  Release: android/app/build/outputs/apk/release/app-release.apk"
    print_info "  AAB:     android/app/build/outputs/bundle/release/app-release.aab"
    print_info ""
    print_info "Next steps:"
    print_info "  1. Run: ./android-build.sh open"
    print_info "  2. In Android Studio: Build → Build APK"
    print_info ""
}

# Open in Android Studio
open_android_studio() {
    print_header "Opening Android Studio"

    if [ ! -d "android" ]; then
        print_error "Android folder not found!"
        print_info "Run: ./android-build.sh setup"
        exit 1
    fi

    print_step "Running: npx cap open android"
    print_warning "Android Studio will open shortly..."

    if npx cap open android; then
        print_success "Android Studio opened"
        print_info ""
        print_info "Wait for Gradle sync to complete (2-5 minutes first time)"
        print_info "Look for 'Gradle sync finished' at the bottom"
        print_info ""
    else
        print_error "Failed to open Android Studio"
        print_info ""
        print_info "Try opening manually:"
        print_info "  1. Open Android Studio"
        print_info "  2. File → Open"
        print_info "  3. Select the 'android' folder"
        print_info ""
        exit 1
    fi
}

# Clean build files
clean_build() {
    print_header "Cleaning Build Files"

    print_step "Cleaning dist folder..."
    if [ -d "dist" ]; then
        rm -rf dist
        print_success "dist/ cleaned"
    else
        print_info "dist/ doesn't exist (already clean)"
    fi

    if [ -d "android" ]; then
        print_step "Cleaning Android build folder..."
        if [ -d "android/app/build" ]; then
            rm -rf android/app/build
            print_success "android/app/build/ cleaned"
        else
            print_info "android/app/build/ doesn't exist (already clean)"
        fi

        print_step "Cleaning Gradle cache..."
        cd android
        if [ -f "./gradlew" ]; then
            if ./gradlew clean; then
                print_success "Gradle cleaned"
            else
                print_warning "Gradle clean had warnings (usually ok)"
            fi
        else
            print_warning "Gradle wrapper not found, skipping Gradle clean"
        fi
        cd ..
    else
        print_warning "android/ folder doesn't exist, skipping Android clean"
    fi

    print_header "Clean Complete!"
    print_info "Run './android-build.sh build' to rebuild"
}

# Full clean (removes android folder)
full_clean() {
    print_header "Deep Clean (Removes Android Folder)"

    print_warning "This will remove the entire android/ folder"
    read -p "Are you sure? This cannot be undone! (y/N): " -n 1 -r
    echo

    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Cancelled"
        exit 0
    fi

    print_step "Removing dist folder..."
    rm -rf dist
    print_success "dist/ removed"

    print_step "Removing android folder..."
    rm -rf android
    print_success "android/ removed"

    print_header "Deep Clean Complete!"
    print_info ""
    print_info "To rebuild from scratch:"
    print_info "  1. Run: ./android-build.sh setup"
    print_info "  2. Run: ./android-build.sh open"
    print_info ""
}

# Check versions
check_versions() {
    print_header "Checking Tool Versions"

    echo ""

    if command -v node &> /dev/null; then
        print_info "Node.js: $(node --version)"
    else
        print_warning "Node.js: Not found"
    fi

    if command -v npm &> /dev/null; then
        print_info "npm: $(npm --version)"
    else
        print_warning "npm: Not found"
    fi

    if [ -f "package.json" ]; then
        CAP_VERSION=$(grep -o '"@capacitor/core": "[^"]*"' package.json | cut -d'"' -f4)
        if [ -n "$CAP_VERSION" ]; then
            print_info "Capacitor: $CAP_VERSION"
        fi

        APP_VERSION=$(grep -o '"version": "[^"]*"' package.json | head -1 | cut -d'"' -f4)
        if [ -n "$APP_VERSION" ]; then
            print_info "App version: $APP_VERSION"
        fi
    fi

    if [ -f "android/gradle/wrapper/gradle-wrapper.properties" ]; then
        GRADLE_VERSION=$(grep -o 'gradle-[0-9.]*-' android/gradle/wrapper/gradle-wrapper.properties | head -1 | sed 's/gradle-//;s/-//')
        if [ -n "$GRADLE_VERSION" ]; then
            print_info "Gradle: $GRADLE_VERSION"

            if [[ "$GRADLE_VERSION" < "8.5" ]]; then
                print_warning "Gradle version is below 8.5 (recommended)"
                print_info "Update in: android/gradle/wrapper/gradle-wrapper.properties"
            else
                print_success "Gradle version is up to date"
            fi
        fi
    fi

    if [ -d "android" ]; then
        print_info "Android folder: Exists"
    else
        print_warning "Android folder: Not found (run setup)"
    fi

    if [ -d "dist" ]; then
        DIST_SIZE=$(du -sh dist 2>/dev/null | cut -f1)
        print_info "Build output: $DIST_SIZE"
    else
        print_warning "Build output: Not found (run build)"
    fi

    echo ""
}

# Show help
show_help() {
    echo ""
    echo -e "${CYAN}╔════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║     PIT-BOX Android Build Helper          ║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}Usage:${NC} ./android-build.sh [command]"
    echo ""
    echo -e "${YELLOW}Commands:${NC}"
    echo -e "  ${GREEN}setup${NC}       - First time Android setup (adds Android platform)"
    echo -e "  ${GREEN}build${NC}       - Build web app and sync to Android (use this most often)"
    echo -e "  ${GREEN}open${NC}        - Open project in Android Studio"
    echo -e "  ${GREEN}clean${NC}       - Clean build files (dist, android/build, Gradle cache)"
    echo -e "  ${GREEN}full-clean${NC}  - Deep clean (removes entire android folder)"
    echo -e "  ${GREEN}version${NC}     - Check versions of all tools"
    echo -e "  ${GREEN}help${NC}        - Show this help message"
    echo ""
    echo -e "${YELLOW}Typical workflow:${NC}"
    echo -e "  ${CYAN}1.${NC} First time only:"
    echo -e "     ${GREEN}./android-build.sh setup${NC}"
    echo ""
    echo -e "  ${CYAN}2.${NC} Every time you make changes:"
    echo -e "     ${GREEN}./android-build.sh build${NC}"
    echo ""
    echo -e "  ${CYAN}3.${NC} Then open Android Studio:"
    echo -e "     ${GREEN}./android-build.sh open${NC}"
    echo ""
    echo -e "  ${CYAN}4.${NC} In Android Studio:"
    echo -e "     Build → Build APK"
    echo ""
    echo -e "${YELLOW}Quick commands:${NC}"
    echo -e "  Build and open: ${GREEN}./android-build.sh build && ./android-build.sh open${NC}"
    echo -e "  Check status:   ${GREEN}./android-build.sh version${NC}"
    echo -e "  Fresh start:    ${GREEN}./android-build.sh full-clean && ./android-build.sh setup${NC}"
    echo ""
    echo -e "${YELLOW}Troubleshooting:${NC}"
    echo -e "  If build fails:      ${GREEN}./android-build.sh clean && ./android-build.sh build${NC}"
    echo -e "  If sync has issues:  ${GREEN}./android-build.sh full-clean && ./android-build.sh setup${NC}"
    echo ""
}

# Main script
main() {
    # Print banner
    echo -e "${CYAN}"
    echo "╔═══════════════════════════════════════════════╗"
    echo "║                                               ║"
    echo "║         PIT-BOX Android Build Script         ║"
    echo "║              Version 1.0.0                    ║"
    echo "║                                               ║"
    echo "╚═══════════════════════════════════════════════╝"
    echo -e "${NC}"

    # Check if we're in the project root
    if [ ! -f "capacitor.config.ts" ]; then
        print_error "Not in project root directory!"
        print_info "This script must be run from the project root folder"
        print_info "Current directory: $(pwd)"
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
        full-clean|fullclean)
            full_clean
            ;;
        version|versions|-v|--version)
            check_versions
            ;;
        help|--help|-h|"")
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
