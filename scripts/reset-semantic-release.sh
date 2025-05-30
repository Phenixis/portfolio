#!/bin/bash

# Script to reset semantic-release by creating a baseline tag
# This prevents semantic-release from analyzing the entire commit history

set -e

echo "🔧 Resetting semantic-release baseline..."

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Check if there are any existing tags
if git describe --tags --abbrev=0 2>/dev/null; then
    echo "⚠️  Warning: Existing tags found. This script is meant for first-time setup."
    echo "Existing tags:"
    git tag --list
    read -p "Do you want to continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Aborted"
        exit 1
    fi
fi

# Create baseline tag
echo "📝 Creating baseline tag v0.0.0..."
git tag v0.0.0
git push origin v0.0.0

echo "✅ Baseline tag created successfully!"
echo "🚀 Semantic-release will now start from this point and only analyze new commits."
echo ""
echo "Next steps:"
echo "1. Make a conventional commit (e.g., 'feat: add new feature')"
echo "2. Push to main/canary branch"
echo "3. The release workflow will create the next version automatically"
