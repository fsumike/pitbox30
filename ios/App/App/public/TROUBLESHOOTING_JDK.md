# Troubleshooting: Invalid Gradle JDK Configuration

## If Android Studio STILL Shows the JDK Error

**This should NOT happen**, but here's how to fix it manually:

---

## Solution 1: Check Gradle Settings in Android Studio

1. **Open Android Studio Settings:**
   - Windows/Linux: File → Settings
   - Mac: Android Studio → Preferences

2. **Navigate to:**
   ```
   Build, Execution, Deployment → Build Tools → Gradle
   ```

3. **Look for "Gradle JDK" dropdown:**
   - Should show: "Embedded JDK (jbr-17)" or "jbr-17"
   - If not, select it from the dropdown
   - Click Apply → OK

4. **Sync Gradle:**
   - File → Sync Project with Gradle Files

---

## Solution 2: Verify gradle.properties

1. **Open:** `android/gradle.properties`

2. **Find this line:**
   ```properties
   org.gradle.java.home=D\:\\Program Files\\Android\\Android Studio\\jbr
   ```

3. **If the path is different on your system:**
   - Find your Android Studio installation path
   - Common locations:
     - Windows: `D:\Program Files\Android\Android Studio\jbr`
     - Windows (User): `C:\Program Files\Android\Android Studio\jbr`
     - Mac: `/Applications/Android Studio.app/Contents/jbr`
     - Linux: `/opt/android-studio/jbr` or `~/android-studio/jbr`

4. **Update the line with your correct path:**
   ```properties
   org.gradle.java.home=YOUR\\PATH\\TO\\ANDROID STUDIO\\jbr
   ```

   **Important:** Use double backslashes `\\` on Windows!

---

## Solution 3: Update local.properties

1. **Open:** `android/local.properties`

2. **Update SDK path:**
   ```properties
   sdk.dir=C\:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk
   ```

3. **Find your SDK path:**
   - Open Android Studio
   - File → Settings → Appearance & Behavior → System Settings → Android SDK
   - Copy the "Android SDK Location" path
   - Replace backslashes with double backslashes `\\`

---

## Solution 4: Delete .gradle Cache

If Gradle is using an old configuration:

```bash
cd android
rm -rf .gradle
rm -rf .idea
```

Then reopen the project in Android Studio.

---

## Solution 5: Check Java Version

Make sure you have JDK 17 installed:

```bash
java -version
```

Should show: `openjdk version "17.x.x"`

If not:
- Android Studio's embedded JDK is at: `Android Studio/jbr/bin/java`
- Run: `"D:\Program Files\Android\Android Studio\jbr\bin\java" -version`

---

## Solution 6: Invalidate Caches

1. **In Android Studio:**
   - File → Invalidate Caches
   - Check "Clear downloaded shared indexes"
   - Click "Invalidate and Restart"

2. **Wait for restart and sync**

---

## Solution 7: Fresh Gradle Wrapper Download

```bash
cd android
rm -rf gradle/wrapper
./gradlew wrapper --gradle-version 8.11.1
```

This forces Gradle to download fresh files.

---

## Solution 8: Command Line Build Test

Test if Gradle works from command line:

```bash
cd android
./gradlew tasks
```

If this works but Android Studio doesn't, it's an IDE configuration issue.

**Solution:** Use Solution 1 (Check Gradle Settings)

---

## Solution 9: Check JAVA_HOME Environment Variable

Windows:
```cmd
echo %JAVA_HOME%
```

Mac/Linux:
```bash
echo $JAVA_HOME
```

If it points to a wrong Java version:
- **Don't change it!** Instead, use `gradle.properties` (already configured)
- The `org.gradle.java.home` setting overrides JAVA_HOME

---

## Solution 10: Manual JDK Selection Dialog

If you see the "Invalid Gradle JDK configuration found" dialog:

1. **Option 1: Use Embedded JDK (Recommended)**
   - Click the "Use Embedded JDK" button
   - Should point to: `D:\Program Files\Android\Android Studio\jbr`
   - Click OK

2. **Option 2: Change Gradle JDK Location**
   - Click "Change Gradle JDK location"
   - Select "Embedded JDK (jbr-17)" from dropdown
   - Click OK

---

## Verification Steps

After applying any solution, verify:

1. ✅ Gradle sync completes without errors
2. ✅ No red underlines in build files
3. ✅ Build → Make Project succeeds
4. ✅ Can run app on device/emulator

---

## Common Mistakes

### ❌ Wrong Path Format
```properties
# WRONG (single backslash)
org.gradle.java.home=D:\Program Files\Android\Android Studio\jbr

# CORRECT (double backslash)
org.gradle.java.home=D\:\\Program Files\\Android\\Android Studio\\jbr
```

### ❌ Using JDK 8 or JDK 11
AGP 8.x requires JDK 17 minimum!

### ❌ Mixing Gradle Versions
Make sure:
- `gradle-wrapper.properties` has: `gradle-8.11.1-all.zip`
- `build.gradle` has: `com.android.tools.build:gradle:8.7.3`

---

## Still Not Working?

If you've tried everything above and it still doesn't work:

### Check These Files Match Exactly:

1. **gradle.properties** should have:
   ```properties
   org.gradle.java.home=D\:\\Program Files\\Android\\Android Studio\\jbr
   ```

2. **.idea/gradle.xml** should have:
   ```xml
   <option name="gradleJvm" value="Embedded JDK" />
   ```

3. **build.gradle** should have:
   ```gradle
   classpath 'com.android.tools.build:gradle:8.7.3'
   ```

4. **gradle-wrapper.properties** should have:
   ```properties
   distributionUrl=https\://services.gradle.org/distributions/gradle-8.11.1-all.zip
   ```

---

## Last Resort: Clean Project

```bash
cd android
./gradlew clean
rm -rf .gradle
rm -rf .idea
rm -rf app/build
rm -rf build
```

Then reopen in Android Studio and let it sync from scratch.

---

## Success Indicators

You'll know it's fixed when:

1. ✅ Android Studio shows "BUILD SUCCESSFUL"
2. ✅ Gradle sync completes in < 5 minutes
3. ✅ No JDK-related errors in "Build" tab
4. ✅ All Capacitor plugins load correctly
5. ✅ Build → Make Project works

---

## If Nothing Works

The project configuration is correct. The issue might be:

1. **Corrupted Android Studio installation**
   - Reinstall Android Studio
   - Make sure it installs JDK 17 (jbr)

2. **Permission issues**
   - Run Android Studio as Administrator (Windows)
   - Check file permissions on `android/` folder

3. **Antivirus blocking Gradle**
   - Add Gradle to antivirus exceptions
   - Try disabling antivirus temporarily during sync

---

**The project IS configured correctly. These solutions will resolve any remaining issues on your specific system.**
