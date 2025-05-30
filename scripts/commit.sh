#!/bin/bash

# Conventional Commit Helper Script
# Usage: ./scripts/commit.sh

echo "🚀 Conventional Commit Helper"
echo "=============================="

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
)

echo "Select commit type:"
for key in $(echo ${!commit_types[@]} | tr ' ' '\n' | sort -n); do
    IFS=':' read -r type desc <<< "${commit_types[$key]}"
    echo "  $key) $type ($desc)"
done

read -p "Enter choice (1-10): " choice

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
read -p "Is this a breaking change? (y/N): " breaking
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

echo "✅ Commit created successfully!"
