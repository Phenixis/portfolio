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
echo "🧹 Note: You may want to manually clean up old branches if they exist:"
echo "   - Remove 'canary' branch if no longer needed"
echo "   - Remove any feature branches that are no longer needed"
echo ""
echo "   Commands to clean up (run manually if desired):"
echo "   git branch -D canary"
echo "   git push origin --delete canary"
echo "   # List and remove any old feature branches as needed"
echo ""

echo "🎉 Simplified pre-release workflow setup complete!"
echo ""
echo "📋 How to use the new workflow:"
echo "1. Work on the 'dev' branch for all development"
echo "2. Use conventional commits (feat:, fix:, etc.)"
echo "3. Every significant commit creates a pre-release (e.g., v1.2.0-dev.1)"
echo "4. When ready for stable release, use '[promote]' in commit message"
echo "5. Or manually trigger 'Promote to Stable Release' in GitHub Actions"
echo "6. Review and merge the auto-created PR to release stable version"
echo ""
echo "🔗 Commit message examples:"
echo "   feat: add new user dashboard (creates v1.1.0-dev.1)"
echo "   fix: resolve login issue (creates v1.1.0-dev.2)" 
echo "   feat!: change API structure (creates v2.0.0-dev.1)"
echo "   docs: update readme [promote] (triggers stable release PR)"
