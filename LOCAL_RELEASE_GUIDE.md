# Local Version Management Setup Guide

This project uses a **local version management** system where versions are updated locally on every commit, and GitHub Actions handle promotion and publishing.

## 🚀 How It Works

### 1. **Local Development**
- Use `pnpm commit` for all commits
- A local script analyzes conventional commits and updates `package.json` version + `CHANGELOG.md`
- No GitHub releases are created locally

### 2. **Promotion to Main**
- When ready to release, use `pnpm promote` 
- This adds `[promote]` flag to a commit
- GitHub Actions detects the flag and automatically:
  - Merges `dev` → `main`
  - Creates GitHub release from the version in `package.json`
  - Syncs changes back to `dev`

## 📋 Usage

### Daily Development
```bash
# Make your changes
# Use the interactive commit helper
pnpm commit

# The script will:
# 1. Guide you through conventional commit format
# 2. Create the commit
# 3. Analyze commits and update version locally
# 4. Update package.json version and CHANGELOG.md
```

### Manual Version Bump
```bash
# Run version bump separately
pnpm version-bump
```

### When Ready to Release
```bash
# Promote the current dev version to main
pnpm promote

# This will:
# 1. Show current versions
# 2. Allow you to add [promote] flag
# 3. Trigger GitHub Actions workflow
```

## 🔧 Configuration Files

- **`scripts/local-version-bump.sh`** - Local version analysis and bump script
- **`.releaserc.json`** - CI semantic-release config (GitHub publishing)
- **`scripts/commit.sh`** - Interactive commit helper with local version bump
- **`scripts/promote-release.sh`** - Promotion helper
- **`.github/workflows/release.yml`** - GitHub Actions for promotion and publishing

## 🌟 Benefits

- **Immediate feedback** - Version updates happen instantly
- **No external dependencies** - Works completely offline
- **Simple and reliable** - No complex semantic-release configuration
- **Controlled releases** - Manual promotion to production

## 🔍 Troubleshooting

### If local version bump fails:
```bash
# Check if you're on a valid branch
git branch --show-current  # Should be 'main' or 'dev'

# Check recent commits
git log --oneline -5

# Run version bump manually
pnpm version-bump
```

### If promotion fails:
- Check GitHub Actions logs
- Ensure `[promote]` is in the commit message
- Verify you're on the `dev` branch
- Make sure there are no merge conflicts

## 📝 Commit Types

- **feat:** new features (minor version)
- **fix:** bug fixes (patch version)
- **perf:** performance improvements (patch)
- **refactor:** code refactoring (patch)
- **style:** code style changes (patch)
- **docs:** documentation (no release)
- **test:** tests (no release)
- **chore:** maintenance (no release)

## 🔄 Branch Strategy

- **`dev`** - Development branch (pre-releases with timestamps)
- **`main`** - Production branch (stable releases)
- Use `[promote]` to move from dev → main

## 📊 Version Format

- **Main branch**: `1.2.3` (standard semver)
- **Dev branch**: `1.2.3-dev.1620000000` (with timestamp suffix)
