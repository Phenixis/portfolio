#!/bin/bash

# Conventional Commit Helper Script
# Usage: ./scripts/commit.sh

echo "🚀 Conventional Commit Helper"
echo "=============================="

# Define commit types
declare -A commit_types=(
    ["1"]="feat:New feature - minor"
    ["2"]="fix:Bug fix - patch"
    ["3"]="docs:Documentation change - patch"
    ["4"]="style:Code style change - patch"
    ["5"]="refactor:Code refactoring - patch"
    ["6"]="perf:Performance improvement - patch"
    ["7"]="test:Test changes - patch"
    ["8"]="chore:Non-functional change - patch"
    ["9"]="security:Security fix - patch"
    ["10"]="revert:Revert changes - patch"
    ["11"]="done:Completed tasks - patch"
    ["12"]="wip:Work in progress - patch"
    ["13"]="started:New tasks - patch"
)

echo "Select commit type:"
for key in $(echo ${!commit_types[@]} | tr ' ' '\n' | sort -n); do
    IFS=':' read -r type desc <<< "${commit_types[$key]}"
    echo "  $key) $type ($desc)"
done

read -p "Enter choice (1-13): " choice

if [[ ! ${commit_types[$choice]} ]]; then
    echo "❌ Invalid choice"
    exit 1
fi

IFS=':' read -r type desc <<< "${commit_types[$choice]}"

# Get scope (optional)
read -p "Enter scope (optional, press enter to skip): " scope
if [[ -n "$scope" ]]; then
    scope="($scope)"
fi

# Get description
read -p "Enter commit description: " description
if [[ -z "$description" ]]; then
    echo "❌ Description is required"
    exit 1
fi

# Check for breaking change
read -p "Is this a breaking change (major) ? (y/N): " breaking
if [[ "$breaking" =~ ^[Yy]$ ]]; then
    type="${type}!"
fi

# Get optional body
read -p "Enter commit body (optional, press enter to skip): " body

# Get optional footer
read -p "Enter commit footer (optional, press enter to skip): " footer

# Construct commit message
commit_msg="${type}${scope}: ${description}"

if [[ -n "$body" ]]; then
    commit_msg="${commit_msg}

${body}"
fi

if [[ -n "$footer" ]]; then
    commit_msg="${commit_msg}

${footer}"
fi

# Show preview
echo ""
echo "📝 Commit message preview:"
echo "========================="
echo "$commit_msg"
echo "========================="

read -p "Proceed with this commit? (Y/n): " proceed
if [[ "$proceed" =~ ^[Nn]$ ]]; then
    echo "❌ Commit cancelled"
    exit 1
fi

# Execute commit
git add -A
git commit -m "$commit_msg"

# Run local semantic release to update version and changelog
echo ""
echo "🔄 Running local version bump..."

# Check current branch
current_branch=$(git branch --show-current)
valid_branches=("main" "dev")

if [[ " ${valid_branches[@]} " =~ " ${current_branch} " ]]; then
    # Run local version bump script
    if ./scripts/local-version-bump.sh; then
        echo "✅ Local version bump completed"
        
        # Show what was updated
        echo ""
        echo "📋 Changes made:"
        echo "  • Version in package.json: $(grep '"version":' package.json | cut -d'"' -f4)"
        echo "  • CHANGELOG.md updated"
        echo ""
        echo "💡 Push your changes to trigger remote release workflow"
    else
        echo "ℹ️  No version bump needed (no releasable changes)"
    fi
else
    echo "⚠️  Skipping version bump - not on release branch (current: $current_branch)"
    echo "   Version bumps only run on: ${valid_branches[*]}"
fi

git add .
git commit -m "chore: update version and changelog after commit"

echo ""
echo "✅ Commit created successfully!"
