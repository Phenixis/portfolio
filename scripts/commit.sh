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

# Display branch-specific workflow info
if [[ "$current_branch" == "fix" ]]; then
    echo ""
    echo "🔧 Fix branch detected - Hotfix workflow will be used"
    echo "   → Patch version bump → Push to fix → Merge to main"
    echo "   ⚠️  This will immediately deploy to production!"
    echo ""
elif [[ "$current_branch" == "dev" ]]; then
    echo ""
    echo "🚀 Dev branch detected - Development workflow will be used"
    echo "   → Patch version bump → Option to promote to main"
    echo ""
fi

# Display the modified files
echo "Modified files:"
git diff --name-only | while read -r file; do
    echo "  - $file"
done

echo ""

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
    echo "⚠️  Warning: Description is too long (${#description} characters). It will be truncated to 100 characters."
    truncated_desc="${description:0:100}"
    echo "Truncated commit description:"
    echo "  $truncated_desc"
    description="$truncated_desc"
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

# Branch-specific workflow
if [[ "$current_branch" == "fix" ]]; then
    # Hotfix workflow: auto-bump version, commit, push to fix, merge to main
    echo ""
    echo "🔧 Executing hotfix workflow..."
    echo "⚠️  WARNING: This will immediately deploy to production!"
    echo ""
    read -p "Are you sure you want to proceed with the hotfix? (y/N): " confirm_hotfix
    if [[ ! "$confirm_hotfix" =~ ^[Yy]$ ]]; then
        echo "❌ Hotfix cancelled"
        exit 1
    fi
    
    if ! handle_hotfix_workflow "$commit_msg"; then
        echo "❌ Hotfix workflow failed"
        exit 1
    fi
    
    echo ""
    echo "✅ Hotfix completed successfully!"
    echo "🎯 The fix has been deployed to main branch"
    
else
    # Development workflow: bump version, update changelog, commit, offer promotion
    
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
fi