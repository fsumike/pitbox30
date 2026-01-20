# PowerShell Script to Switch Capawesome from Apple ID to API Key
# Run this in PowerShell (NOT Command Prompt)

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Switch Capawesome to App Store Connect API Key (Windows) ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  IMPORTANT: Run this in PowerShell, not Command Prompt!" -ForegroundColor Yellow
Write-Host ""
Write-Host "────────────────────────────────────────────────────────────"
Write-Host "STEP 1: Get Your App Store Connect API Credentials"
Write-Host "────────────────────────────────────────────────────────────"
Write-Host ""
Write-Host "1. Go to: https://appstoreconnect.apple.com"
Write-Host "2. Click: Users and Access (top right)"
Write-Host "3. Click: Keys tab"
Write-Host "4. Click: App Store Connect API"
Write-Host ""
Write-Host "You need THREE things:"
Write-Host "  📋 Issuer ID (at the top of the page)"
Write-Host "  📋 Key ID (next to your key name)"
Write-Host "  📋 .p8 file (download it - you can only download ONCE!)"
Write-Host ""
Read-Host "Press Enter when you have these three things"
Write-Host ""

Write-Host "────────────────────────────────────────────────────────────"
Write-Host "STEP 2: Enter Your Credentials"
Write-Host "────────────────────────────────────────────────────────────"
Write-Host ""

$IssuerID = Read-Host "Issuer ID"
$KeyID = Read-Host "Key ID"
$P8FilePath = Read-Host "Full path to .p8 file (e.g., C:\Users\YourName\Downloads\AuthKey_ABC123.p8)"
Write-Host ""

# Validate
if ([string]::IsNullOrWhiteSpace($IssuerID) -or [string]::IsNullOrWhiteSpace($KeyID) -or [string]::IsNullOrWhiteSpace($P8FilePath)) {
    Write-Host "❌ Missing required information!" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $P8FilePath)) {
    Write-Host "❌ File not found: $P8FilePath" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Credentials received:" -ForegroundColor Green
Write-Host "   Issuer ID: $IssuerID"
Write-Host "   Key ID: $KeyID"
Write-Host "   P8 File: $P8FilePath"
Write-Host ""

# Read the .p8 file content
$P8Content = Get-Content -Path $P8FilePath -Raw

Write-Host "────────────────────────────────────────────────────────────"
Write-Host "STEP 3: Login to Capawesome CLI"
Write-Host "────────────────────────────────────────────────────────────"
Write-Host ""

npx '@capawesome/cli' login

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Login failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "────────────────────────────────────────────────────────────"
Write-Host "STEP 4: List Current Destinations"
Write-Host "────────────────────────────────────────────────────────────"
Write-Host ""

npx '@capawesome/cli' apps:store-destinations:list --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8

Write-Host ""
Write-Host "────────────────────────────────────────────────────────────"
Write-Host "STEP 5: Delete Old Apple ID Destination"
Write-Host "────────────────────────────────────────────────────────────"
Write-Host ""
Write-Host "Current destination ID: 5cea5914-4a94-4f14-82f8-15b65c9275b7"
Write-Host ""
$DeleteConfirm = Read-Host "Delete the old destination? (y/n)"

if ($DeleteConfirm -eq "y") {
    npx '@capawesome/cli' apps:store-destinations:delete --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8 --store-destination-id 5cea5914-4a94-4f14-82f8-15b65c9275b7
    Write-Host "✅ Old destination deleted" -ForegroundColor Green
}

Write-Host ""
Write-Host "────────────────────────────────────────────────────────────"
Write-Host "STEP 6: Create NEW API Key Destination"
Write-Host "────────────────────────────────────────────────────────────"
Write-Host ""
Write-Host "Creating destination with API key credentials..."
Write-Host ""

# Create a temporary file with the command output
$TempFile = [System.IO.Path]::GetTempFileName()

$Command = "npx '@capawesome/cli' apps:store-destinations:create --app-id 8251f381-4aed-4b20-ac20-a3aad250cbb8 --platform ios --bundle-id com.pitbox.app --app-store-connect-issuer-id `"$IssuerID`" --app-store-connect-key-id `"$KeyID`" --app-store-connect-private-key `"$P8Content`""

Invoke-Expression $Command | Tee-Object -FilePath $TempFile

$Output = Get-Content $TempFile -Raw
Remove-Item $TempFile

Write-Host ""

# Extract the new destination ID using regex
if ($Output -match '([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})') {
    $NewID = $Matches[1]
    Write-Host "✅ New destination created!" -ForegroundColor Green
    Write-Host "   Destination ID: $NewID" -ForegroundColor Green
    Write-Host ""

    Write-Host "────────────────────────────────────────────────────────────"
    Write-Host "STEP 7: Update capawesome.config.json"
    Write-Host "────────────────────────────────────────────────────────────"
    Write-Host ""
    Write-Host "Updating config file with new destination ID..."

    # Backup
    Copy-Item capawesome.config.json capawesome.config.json.backup

    # Update the destination ID
    $ConfigContent = Get-Content capawesome.config.json -Raw
    $ConfigContent = $ConfigContent -replace '5cea5914-4a94-4f14-82f8-15b65c9275b7', $NewID
    Set-Content -Path capawesome.config.json -Value $ConfigContent

    Write-Host "✅ Config updated!" -ForegroundColor Green
    Write-Host ""
    Write-Host "────────────────────────────────────────────────────────────"
    Write-Host "STEP 8: Verify the Change"
    Write-Host "────────────────────────────────────────────────────────────"
    Write-Host ""

    Select-String -Path capawesome.config.json -Pattern "destinationId"

    Write-Host ""
    Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Green
    Write-Host "✅ SETUP COMPLETE!" -ForegroundColor Green
    Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your Capawesome configuration now uses App Store Connect API"
    Write-Host "instead of Apple ID for authentication."
    Write-Host ""
    Write-Host "📋 Next Steps:"
    Write-Host ""
    Write-Host "1. Increment build number in capawesome.config.json"
    Write-Host "   Current: 98 → Change to: 99"
    Write-Host ""
    Write-Host "2. Build and upload:"
    Write-Host "   npm run build:ci:ios"
    Write-Host "   npm run capawesome:build:ios"
    Write-Host ""
    Write-Host "3. Monitor at:"
    Write-Host "   https://cloud.capawesome.io/apps/8251f381-4aed-4b20-ac20-a3aad250cbb8/builds"
    Write-Host ""
    Write-Host "💡 Backup saved: capawesome.config.json.backup"
    Write-Host ""
} else {
    Write-Host "❌ Failed to create destination or couldn't extract ID" -ForegroundColor Red
    Write-Host "Please check the output above for errors"
    exit 1
}
