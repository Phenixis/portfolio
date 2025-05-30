#!/bin/bash

# Script to set up the simplified branching workflow
# This script will help transition from the old multi-branch setup to the new dev/main workflow

echo "🔄 Setting up simplified branching workflow..."

# Ensure we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Fetch latest changes
echo "📡 Fetching latest changes..."
git fetch --all

# Create dev branch if it doesn't exist
if ! git show-ref --verify --quiet refs/heads/dev; then
    echo "🌟 Creating dev branch from main..."
    git checkout main
    git pull origin main
    git checkout -b dev
    git push -u origin dev
    echo "✅ Dev branch created and pushed"
else
    echo "✅ Dev branch already exists"
fi

# Switch to dev branch
echo "🔄 Switching to dev branch..."
git checkout dev

# Clean up old version branches (optional - commented out for safety)
echo "🧹 Note: You may want to manually clean up old version branches:"
echo "   - Remove 'canary' branch if no longer needed"
echo "   - Remove any 'V*.*.*' branches that are no longer needed"
echo ""
echo "   Commands to clean up (run manually if desired):"
echo "   git branch -D canary"
echo "   git push origin --delete canary"
echo "   git branch | grep 'V[0-9]' | xargs -r git branch -D"
echo ""

echo "🎉 Simplified workflow setup complete!"
echo ""
echo "📋 How to use the new workflow:"
echo "1. Work on the 'dev' branch for all development"
echo "2. Use conventional commits (feat:, fix:, etc.)"
echo "3. When you push to dev with feat: or BREAKING CHANGE:, an auto-PR will be created"
echo "4. The PR will auto-merge to main if checks pass"
echo "5. Semantic-release will then create the actual release on main"
echo ""
echo "🔗 Commit message examples:"
echo "   feat: add new user dashboard (creates minor release)"
echo "   fix: resolve login issue (creates patch release)"
echo "   feat!: change API structure (creates major release)"
echo "   feat: add feature\\n\\nBREAKING CHANGE: API endpoint changed (creates major release)"
