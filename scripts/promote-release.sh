#!/bin/bash

# Script to help promote pre-releases to stable releases
# Usage: ./scripts/promote-release.sh [--auto]

echo "🚀 Release Promotion Helper"
echo ""

# Check if we're in the dev branch
current_branch=$(git branch --show-current)
if [ "$current_branch" != "dev" ]; then
    echo "⚠️  Warning: You're not on the dev branch (currently on: $current_branch)"
    echo "Switching to dev branch..."
    git checkout dev
    git pull origin dev
fi

# Get current version info
dev_version=$(node -p "require('./package.json').version" 2>/dev/null || echo "unknown")
echo "📦 Current dev version: $dev_version"

# Check if there are uncommitted changes
if ! git diff --quiet || ! git diff --staged --quiet; then
    echo "⚠️  You have uncommitted changes. Please commit or stash them first."
    git status --short
    exit 1
fi

# Get the latest stable version from main
git fetch origin main
git checkout main >/dev/null 2>&1
main_version=$(node -p "require('./package.json').version" 2>/dev/null || echo "unknown") 
git checkout dev >/dev/null 2>&1

echo "📦 Current main version: $main_version"
echo ""

# Check if promotion is needed
if [ "$dev_version" = "$main_version" ]; then
    echo "✅ No promotion needed - versions are already in sync"
    exit 0
fi

# Remove pre-release suffix for comparison
dev_base_version=$(echo $dev_version | sed 's/-dev\.[0-9]*$//')

echo "🎯 Ready to promote: $dev_version → $dev_base_version (stable)"
echo ""

# Check for --auto flag
if [ "$1" = "--auto" ]; then
    echo "🤖 Auto mode: Creating promotion commit..."
    git commit --allow-empty -m "chore: promote $dev_base_version to stable [promote]"
    git push origin dev
    echo "✅ Promotion triggered! Check GitHub Actions for the auto-created PR."
else
    echo "Choose promotion method:"
    echo "1. Add [promote] to next commit (recommended)"
    echo "2. Create empty promotion commit now"
    echo "3. Manual GitHub Actions trigger"
    echo "4. Cancel"
    echo ""
    read -p "Enter your choice (1-4): " choice

    case $choice in
        1)
            echo ""
            echo "📝 Add '[promote]' to your next commit message, for example:"
            echo "   git commit -m \"docs: update changelog [promote]\""
            echo "   git push origin dev"
            echo ""
            echo "Or commit with the flag right now:"
            read -p "Enter commit message (or press Enter to skip): " commit_msg
            if [ -n "$commit_msg" ]; then
                git commit --allow-empty -m "$commit_msg [promote]"
                git push origin dev
                echo "✅ Promotion triggered!"
            fi
            ;;
        2)
            git commit --allow-empty -m "chore: promote $dev_base_version to stable [promote]"
            git push origin dev
            echo "✅ Promotion triggered! Check GitHub Actions for the auto-created PR."
            ;;
        3)
            echo ""
            echo "🌐 Go to GitHub Actions → 'Promote to Stable Release' → 'Run workflow'"
            echo "   https://github.com/$(git config remote.origin.url | sed 's/.*github.com[:/]\([^.]*\).*/\1/')/actions/workflows/auto-release-pr.yml"
            ;;
        4)
            echo "❌ Cancelled"
            exit 0
            ;;
        *)
            echo "❌ Invalid choice"
            exit 1
            ;;
    esac
fi

echo ""
echo "📋 Next steps:"
echo "1. Wait for the PR to be created (check GitHub Actions)"
echo "2. Review the PR when ready"
echo "3. Merge the PR to create stable release $dev_base_version"
echo "4. The stable release will be published automatically"
