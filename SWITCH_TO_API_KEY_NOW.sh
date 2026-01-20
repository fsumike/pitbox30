#!/bin/bash

# STEP-BY-STEP: Switch from Apple ID to App Store Connect API Key
# This is the ONLY way to do it - there's no web UI for this

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Switch Capawesome from Apple ID to API Key Method        ║"
echo "╔════════════════════════════════════════════════════════════╝"
echo ""
echo "⚠️  IMPORTANT: The web UI does NOT have this option!"
echo "   You MUST use the CLI commands below."
echo ""
echo "────────────────────────────────────────────────────────────"
echo "STEP 1: Get Your App Store Connect API Credentials"
echo "────────────────────────────────────────────────────────────"
echo ""
echo "1. Go to: https://appstoreconnect.apple.com"
echo "2. Click: Users and Access (top right)"
echo "3. Click: Keys tab"
echo "4. Click: App Store Connect API"
echo ""
echo "You need THREE things:"
echo "  📋 Issuer ID (at the top of the page)"
echo "  📋 Key ID (next to your key name)"
echo "  📋 .p8 file (download it - you can only download ONCE!)"
echo ""
read -p "Press Enter when you have these three things..."
echo ""

echo "────────────────────────────────────────────────────────────"
echo "STEP 2: Enter Your Credentials"
echo "────────────────────────────────────────────────────────────"
echo ""

read -p "Issuer ID: " ISSUER_ID
read -p "Key ID: " KEY_ID
read -p "Path to .p8 file (e.g., ./AuthKey_ABC123.p8): " P8_FILE
echo ""

# Validate
if [ -z "$ISSUER_ID" ] || [ -z "$KEY_ID" ] || [ -z "$P8_FILE" ]; then
    echo "❌ Missing required information!"
    exit 1
fi

if [ ! -f "$P8_FILE" ]; then
    echo "❌ File not found: $P8_FILE"
    exit 1
fi

echo "✅ Credentials received:"
echo "   Issuer ID: $ISSUER_ID"
echo "   Key ID: $KEY_ID"
echo "   P8 File: $P8_FILE"
echo ""

echo "────────────────────────────────────────────────────────────"
echo "STEP 3: Login to Capawesome CLI"
echo "────────────────────────────────────────────────────────────"
echo ""

npx @capawesome/cli login

if [ $? -ne 0 ]; then
    echo "❌ Login failed!"
    exit 1
fi

echo ""
echo "────────────────────────────────────────────────────────────"
echo "STEP 4: List Current Destinations"
echo "────────────────────────────────────────────────────────────"
echo ""

npx @capawesome/cli apps:store-destinations:list \
  --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8

echo ""
echo "────────────────────────────────────────────────────────────"
echo "STEP 5: Delete Old Apple ID Destination"
echo "────────────────────────────────────────────────────────────"
echo ""
echo "Current destination ID: 5cea5914-4a94-4f14-82f8-15b65c9275b7"
echo ""
read -p "Delete the old destination? (y/n): " DELETE_CONFIRM

if [ "$DELETE_CONFIRM" = "y" ]; then
    npx @capawesome/cli apps:store-destinations:delete \
      --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8 \
      --store-destination-id 5cea5914-4a94-4f14-82f8-15b65c9275b7

    echo "✅ Old destination deleted"
fi

echo ""
echo "────────────────────────────────────────────────────────────"
echo "STEP 6: Create NEW API Key Destination"
echo "────────────────────────────────────────────────────────────"
echo ""
echo "Creating destination with API key credentials..."
echo ""

OUTPUT=$(npx @capawesome/cli apps:store-destinations:create \
  --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8 \
  --platform ios \
  --bundle-id com.pitbox.app \
  --app-store-connect-issuer-id "$ISSUER_ID" \
  --app-store-connect-key-id "$KEY_ID" \
  --app-store-connect-private-key "$(cat $P8_FILE)")

echo "$OUTPUT"
echo ""

# Extract the new destination ID
NEW_ID=$(echo "$OUTPUT" | grep -oE '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' | head -1)

if [ -z "$NEW_ID" ]; then
    echo "❌ Failed to create destination or couldn't extract ID"
    echo "Please check the output above for errors"
    exit 1
fi

echo "✅ New destination created!"
echo "   Destination ID: $NEW_ID"
echo ""

echo "────────────────────────────────────────────────────────────"
echo "STEP 7: Update capawesome.config.json"
echo "────────────────────────────────────────────────────────────"
echo ""
echo "Updating config file with new destination ID..."

# Backup
cp capawesome.config.json capawesome.config.json.backup

# Update the destination ID
sed -i.tmp "s/5cea5914-4a94-4f14-82f8-15b65c9275b7/$NEW_ID/g" capawesome.config.json
rm -f capawesome.config.json.tmp

echo "✅ Config updated!"
echo ""
echo "────────────────────────────────────────────────────────────"
echo "STEP 8: Verify the Change"
echo "────────────────────────────────────────────────────────────"
echo ""

grep "destinationId" capawesome.config.json

echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ SETUP COMPLETE!"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Your Capawesome configuration now uses App Store Connect API"
echo "instead of Apple ID for authentication."
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Increment build number in capawesome.config.json"
echo "   Current: 98 → Change to: 99"
echo ""
echo "2. Build and upload:"
echo "   npm run build:ci:ios"
echo "   npm run capawesome:build:ios"
echo ""
echo "3. Monitor at:"
echo "   https://cloud.capawesome.io/apps/8251f381-4aed-4b20-ac20-a3aad250cbb8/builds"
echo ""
echo "💡 Backup saved: capawesome.config.json.backup"
echo ""
