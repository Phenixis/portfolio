#!/bin/bash

# Script to help promote dev releases to main branch
# Usage: ./scripts/promote-release.sh

echo "🚀 Release Promotion Helper"
echo "============================"

# Check if we're in the dev branch
current_branch=$(git branch --show-current)
if [ "$current_branch" != "dev" ]; then
    echo "❌ Error: You must be on the dev branch to promote releases"
    echo "Current branch: $current_branch"
    echo "Please switch to dev branch first: git checkout dev"
    exit 1
fi

# Check if there are uncommitted changes
if ! git diff --quiet || ! git diff --staged --quiet; then
    echo "⚠️  You have uncommitted changes. Please commit or stash them first."
    git status --short
    exit 1
fi

# Get current version info
dev_version=$(node -p "require('./package.json').version" 2>/dev/null || echo "unknown")
echo "📦 Current dev version: $dev_version"

# Pull latest changes
echo "🔄 Pulling latest changes..."
git pull origin dev

# Get the latest stable version from main
echo "🔍 Checking main branch version..."
git fetch origin main
main_version=$(git show origin/main:package.json | node -p "JSON.parse(require('fs').readFileSync('/dev/stdin')).version" 2>/dev/null || echo "unknown")

echo "📦 Main branch version: $main_version"
echo ""

# Check if promotion is needed
if [ "$dev_version" = "$main_version" ]; then
    echo "✅ No promotion needed - versions are already in sync"
    exit 0
fi

# Remove pre-release suffix for comparison if it exists
clean_dev_version=$(echo $dev_version | sed 's/-dev\.[0-9]*$//')

echo "🎯 Ready to promote:"
echo "   Dev version: $dev_version"
echo "   Will become: $clean_dev_version (stable)"
echo ""

echo "Choose promotion method:"
echo "1. Add [promote] to next commit (recommended)"
echo "2. Create empty promotion commit now"
echo "3. Cancel"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "📝 Add '[promote]' to your next commit message, for example:"
        echo "   git commit -m \"docs: update changelog [promote]\""
        echo "   git push origin dev"
        echo ""
        echo "Or create a commit with the promotion flag right now:"
        read -p "Enter commit message (or press Enter to skip): " commit_msg
        if [ -n "$commit_msg" ]; then
            git commit --allow-empty -m "$commit_msg [promote]"
            echo "📤 Pushing to dev branch..."
            git push origin dev
            echo "✅ Promotion triggered! Check GitHub Actions for progress."
        else
            echo "💡 Remember to add [promote] to your next commit message!"
        fi
        ;;
    2)
        git commit --allow-empty -m "chore: promote v$clean_dev_version to main [promote]"
        echo "📤 Pushing to dev branch..."
        git push origin dev
        echo "✅ Promotion triggered! Check GitHub Actions for progress."
        ;;
    3)
        echo "❌ Cancelled"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "📋 What happens next:"
echo "1. GitHub Actions will detect the [promote] flag"
echo "2. It will merge dev → main automatically"
echo "3. It will create a GitHub release from the package.json version"
echo "4. It will sync the changes back to dev"
echo ""
echo "🌐 Monitor progress at:"
echo "   https://github.com/$(git config remote.origin.url | sed 's/.*github.com[:/]\([^.]*\).*/\1/')/actions"
echo "3. Merge the PR to create stable release $dev_base_version"
echo "4. The stable release will be published automatically"
