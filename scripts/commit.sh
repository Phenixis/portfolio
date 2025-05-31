#!/bin/bash

# import functions from functions.sh
source "$(dirname "$0")/functions.sh"

# Conventional Commit Helper Script
# Usage: ./scripts/commit.sh

if ! validate_git_repo; then
    echo "❌ Invalid git repository or missing required tools"
    return 1
fi


# Check if there are changes to commit
if git diff --staged --quiet && git diff --quiet; then
    echo "❌ No changes to commit"
    exit 1
fi

echo "🚀 Conventional Commit Helper"
echo "=============================="

# Check if we're on "dev" or "fix" branch
current_branch=$(git branch --show-current)
if [[ "$current_branch" != "dev" && "$current_branch" != "fix" ]]; then
    echo "⚠️  Warning: You're on branch '$current_branch', not 'dev' or 'fix'"
    read -p "Continue anyway? (y/N): " continue_choice
    if [[ ! "$continue_choice" =~ ^[Yy]$ ]]; then
        echo "❌ Cancelled"
        exit 1
    fi
fi

# Define commit types
declare -A commit_types=(
    ["1"]="feat:New feature"
    ["2"]="fix:Bug fix"
    ["3"]="docs:Documentation change"
    ["4"]="style:Code style change"
    ["5"]="refactor:Code refactoring"
    ["6"]="perf:Performance improvement"
    ["7"]="test:Test changes"
    ["8"]="chore:Non-functional change"
    ["9"]="security:Security fix"
    ["10"]="revert:Revert changes"
    ["11"]="done:Completed tasks"
    ["12"]="wip:Work in progress"
    ["13"]="started:New tasks"
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

# Get description
read -p "Enter commit description: " description
if [[ -z "$description" ]]; then
    echo "❌ Description is required"
    exit 1
fi

# Validate commit description length and content
if [[ ${#description} -lt 5 ]]; then
    echo "❌ Description must be at least 5 characters long"
    exit 1
fi

if [[ ${#description} -gt 100 ]]; then
    echo "⚠️  Warning: Description is quite long (${#description} characters)"
    read -p "Continue anyway? (y/N): " continue_long_desc
    if [[ ! "$continue_long_desc" =~ ^[Yy]$ ]]; then
        echo "❌ Cancelled"
        exit 1
    fi
fi

# Construct commit message
commit_msg="${type}: $(echo "$description" | tr '[:upper:]' '[:lower:]')"

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

# Update package.json version / always a patch version
new_version=$(update_package_version "patch")
if [[ $? -ne 0 ]]; then
    exit 1
fi

# Update CHANGELOG.md
if ! update_changelog "$commit_msg"; then
    echo "❌ Failed to update CHANGELOG.md"
    exit 1
fi

# Execute commit
git add -A
if ! git commit -m "$commit_msg"; then
    echo "❌ Failed to create commit"
    exit 1
fi

echo ""
echo "✅ Commit created successfully!"

# Run promotion script
./scripts/promote.sh