# Setup Fastlane for Automated Uploads

Fastlane is the industry-standard tool for iOS deployment automation.

## Quick Setup:

### 1. Install Fastlane:
```bash
# On Mac:
brew install fastlane

# Or with Ruby:
sudo gem install fastlane
```

### 2. Initialize Fastlane:
```bash
cd ios/App
fastlane init
```

When prompted:
- **What would you like to use fastlane for?**
  → Select "4. Manual setup"
- **App Identifier**: com.pitbox.app
- **Apple ID**: mg91648@yahoo.com

### 3. Configure App Store Connect API Key:

Create `ios/App/fastlane/Fastfile`:
```ruby
default_platform(:ios)

platform :ios do
  desc "Upload to TestFlight"
  lane :beta do
    # Get the IPA from Capawesome or build locally
    upload_to_testflight(
      api_key_path: "fastlane/app_store_connect_api_key.json",
      skip_waiting_for_build_processing: true
    )
  end
end
```

Create `ios/App/fastlane/app_store_connect_api_key.json`:
```json
{
  "key_id": "YOUR_KEY_ID",
  "issuer_id": "YOUR_ISSUER_ID",
  "key": "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----",
  "in_house": false
}
```

### 4. Upload Build:
```bash
cd ios/App
fastlane beta --ipa path/to/your/app.ipa
```

## Advantages:
- ✅ Uses modern API key authentication
- ✅ Fully automated (set and forget)
- ✅ Industry standard (used by most iOS teams)
- ✅ Can handle certificates, provisioning, screenshots, etc.
- ✅ Works with CI/CD pipelines

## Get API Key:
1. Go to: https://appstoreconnect.apple.com/access/api
2. Click "Keys" → "+" to create
3. Name: "Fastlane Upload"
4. Access: "App Manager"
5. Download .p8 file
6. Copy Key ID and Issuer ID
