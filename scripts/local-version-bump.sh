#!/bin/bash

# Local Version Bump Script
# This script analyzes conventional commits and updates package.json version locally

# Function to get the last tag
get_last_tag() {
    git describe --tags --abbrev=0 2>/dev/null || echo "v0.0.0"
}

# Function to get the latest commit
get_latest_commit() {
    git log -1 --pretty=format:"%s" 2>/dev/null || echo ""
}

# Function to determine version bump type
analyze_commit() {
    local commit="$1"
    local bump_type="none"
    
    # Check for breaking changes
    if [[ "$commit" =~ feat!:|fix!:|perf!:|refactor!:|style!: ]] || [[ "$commit" =~ "BREAKING CHANGE" ]]; then
        bump_type="major"
    # Check for features
    elif [[ "$commit" =~ ^feat: ]] || [[ "$commit" =~ ^feat\( ]]; then
        bump_type="minor"
    # Check for fixes and other patch-level changes
    elif [[ "$commit" =~ ^(fix|perf|refactor|style): ]] || [[ "$commit" =~ ^(fix|perf|refactor|style)\( ]]; then
        bump_type="patch"
    fi
    
    echo "$bump_type"
}

# Function to bump version
bump_version() {
    local current_version="$1"
    local bump_type="$2"
    local branch="$3"
    
    # Remove 'v' prefix if present
    current_version=$(echo "$current_version" | sed 's/^v//')
    
    # Split version into parts
    IFS='.' read -r major minor patch <<< "$current_version"
    
    # Remove any pre-release suffix from patch
    patch=$(echo "$patch" | sed 's/-.*$//')
    
    case "$bump_type" in
        "major")
            major=$((major + 1))
            minor=0
            patch=0
            ;;
        "minor")
            minor=$((minor + 1))
            patch=0
            ;;
        "patch")
            patch=$((patch + 1))
            ;;
        *)
            echo "$current_version"
            return
            ;;
    esac
    
    new_version="$major.$minor.$patch"
    
    # Add pre-release suffix for dev branch
    if [ "$branch" = "dev" ]; then
        new_version="$new_version-dev.$(date +%s)"
    fi
    
    echo "$new_version"
}

# Function to update package.json
update_package_json() {
    local new_version="$1"
    
    # Use node to update package.json
    node -e "
        const fs = require('fs');
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        pkg.version = '$new_version';
        fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
    "
}

# Function to update changelog
update_changelog() {
    local version="$1"
    local commit="$2"
    local date=$(date +%Y-%m-%d)
    
    # Create changelog content
    local changelog_content="## [$version] - $date\n\n"
    
    # Categorize commit
    if [[ "$commit" =~ ^feat ]]; then
        changelog_content="$changelog_content### 🚀 Features\n- $commit\n\n"
    elif [[ "$commit" =~ ^fix ]]; then
        changelog_content="$changelog_content### 🐛 Bug Fixes\n- $commit\n\n"
    elif [[ "$commit" =~ ^(perf|refactor|style): ]]; then
        changelog_content="$changelog_content### 📝 Other Changes\n- $commit\n\n"
    else
        changelog_content="$changelog_content### 📝 Changes\n- $commit\n\n"
    fi
    
    # Insert at the beginning of CHANGELOG.md (after the header)
    if [ -f "CHANGELOG.md" ]; then
        # Create temp file with new content
        {
            head -n 3 CHANGELOG.md
            echo -e "$changelog_content"
            tail -n +4 CHANGELOG.md
        } > CHANGELOG.tmp && mv CHANGELOG.tmp CHANGELOG.md
    else
        # Create new changelog
        echo -e "# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n$changelog_content" > CHANGELOG.md
    fi
}

# Main execution
main() {
    echo "🔍 Analyzing commits for version bump..."
    
    # Get current branch
    current_branch=$(git branch --show-current)
    
    # Check if we're on a valid branch
    if [ "$current_branch" != "main" ] && [ "$current_branch" != "dev" ]; then
        echo "⚠️  Warning: Not on main or dev branch (current: $current_branch)"
    fi
    
    # Get current version from package.json
    current_version=$(node -p "require('./package.json').version" 2>/dev/null || echo "0.0.0")
    echo "📦 Current version: $current_version"
    
    # Get latest commit
    latest_commit=$(get_latest_commit)
    
    if [ -z "$latest_commit" ]; then
        echo "ℹ️  No commits found"
        return 0
    fi
    
    echo "📝 Analyzing latest commit:"
    echo "$latest_commit"
    echo ""
    
    # Analyze commit to determine bump type
    bump_type=$(analyze_commit "$latest_commit")
    
    if [ "$bump_type" = "none" ]; then
        echo "ℹ️  No releasable changes found in latest commit"
        return 0
    fi
    
    # Calculate new version
    last_tag=$(get_last_tag)
    new_version=$(bump_version "$last_tag" "$bump_type" "$current_branch")
    
    echo "🎯 Version bump: $bump_type"
    echo "📈 New version: $new_version"
    
    # Update package.json
    update_package_json "$new_version"
    echo "✅ Updated package.json"
    
    # Update changelog
    update_changelog "$new_version" "$latest_commit"
    echo "✅ Updated CHANGELOG.md"
    
    # Stage the changes
    git add package.json CHANGELOG.md
    
    echo ""
    echo "🎉 Local version bump completed!"
    echo "   Version: $current_version → $new_version"
    echo "   Files updated: package.json, CHANGELOG.md"
}

# Run main function
main "$@"
