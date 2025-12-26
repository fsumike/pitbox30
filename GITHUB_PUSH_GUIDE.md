# GitHub Push Guide - PitBox App

## Complete Process to Push Your Project to GitHub

### Step 1: Initialize Git (Run in Bolt Terminal)

```bash
git init
```

### Step 2: Configure Git (First Time Only)

```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### Step 3: Add All Files

```bash
git add .
```

### Step 4: Create Initial Commit

```bash
git commit -m "Initial commit - PitBox v3.0.0 with Capacitor, Capawesome, and Supabase"
```

### Step 5: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: **pitbox-app** (or whatever you prefer)
3. Make it **Private** (recommended since .env is excluded)
4. **DO NOT** initialize with README, .gitignore, or license
5. Click "Create repository"

### Step 6: Add GitHub Remote

After creating the repo, GitHub will show you commands. Use these:

```bash
git remote add origin https://github.com/YOUR_USERNAME/pitbox-app.git
git branch -M main
```

### Step 7: Push to GitHub

```bash
git push -u origin main
```

---

## If You Already Have a GitHub Repo and Want to Clear It

### Option A: Force Push (Overwrites Everything)

⚠️ **WARNING**: This deletes all history on GitHub

```bash
# Initialize fresh git repo
git init

# Add all files
git add .

# Create initial commit
git commit -m "Fresh start - PitBox v3.0.0"

# Add your existing repo
git remote add origin https://github.com/YOUR_USERNAME/your-repo.git

# Force push (overwrites everything on GitHub)
git push -u origin main --force
```

### Option B: Delete and Recreate Repo

1. Go to your repo on GitHub
2. Settings → Danger Zone → Delete this repository
3. Follow steps in "Step 5" above to create a new repo
4. Follow steps 1-7 above

---

## What Gets Pushed to GitHub

✅ **Included:**
- All source code (`src/`)
- Package files (`package.json`, `package-lock.json`)
- Configuration files
- Supabase migrations
- Documentation files (.md)
- Public assets (logos, icons)
- `.env.example` (template without secrets)

❌ **Excluded (in .gitignore):**
- `node_modules/` (dependencies)
- `dist/` (build output)
- `android/` folder (regenerate with `npx cap add android`)
- `ios/` folder (restore with `tar -xzf ios-platform-backup.tar.gz`)
- `.env` (your actual secrets)
- `*.tar.gz` (backup archives)
- `*.pem`, `*.pub` (private keys)

---

## After Cloning on Another Machine

When you clone this repo elsewhere, you'll need to:

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/pitbox-app.git
cd pitbox-app

# 2. Install dependencies
npm install

# 3. Create .env file from template
cp .env.example .env
# Then edit .env with your actual keys

# 4. Restore iOS platform
tar -xzf ios-platform-backup.tar.gz

# 5. Add Android platform
npx cap add android

# 6. Build and sync
npm run build
npx cap sync
```

---

## Keeping GitHub Updated

After making changes:

```bash
# See what changed
git status

# Add files
git add .

# Commit with a message
git commit -m "Description of changes"

# Push to GitHub
git push
```

---

## Common Issues

**Q: "git push" says "Permission denied"**
A: You need to authenticate with GitHub. Use a Personal Access Token or SSH key.
   - GitHub Settings → Developer settings → Personal access tokens
   - Or set up SSH: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

**Q: I accidentally pushed my .env file!**
A:
1. Add `.env` to `.gitignore` (already done)
2. Remove from git: `git rm --cached .env`
3. Commit: `git commit -m "Remove .env from tracking"`
4. Push: `git push`
5. **IMPORTANT**: Rotate all your API keys since they were exposed!

**Q: Push failed - "fatal: refusing to merge unrelated histories"**
A: Use `git pull origin main --allow-unrelated-histories` then `git push`

---

**Ready to push?** Run the commands in Step 1-7 above!
