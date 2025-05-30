#!/bin/bash

# Local Version Bump Script
# This script analyzes conventional commits and updates package.json version locally

# Function to get the last tag
get_last_tag() {
    git describe --tags --abbrev=0 2>/dev/null || echo "v0.0.0"
}

# Function to get commits since last tag
get_commits_since_tag() {
    last_tag=$(get_last_tag)
    if [ "$last_tag" = "v0.0.0" ]; then
        # If no tags exist, get all commits
        git log --oneline --pretty=format:"%s"
    else
        # Get commits since last tag
        git log "$last_tag"..HEAD --oneline --pretty=format:"%s"
    fi
}

# Function to determine version bump type
analyze_commits() {
    local commits="$1"
    local bump_type="none"
    
    while IFS= read -r commit; do
        # Check for breaking changes
        if [[ "$commit" =~ feat!:|fix!:|perf!:|refactor!:|style!: ]] || [[ "$commit" =~ "BREAKING CHANGE" ]]; then
            bump_type="major"
            break
        # Check for features
        elif [[ "$commit" =~ ^feat: ]] || [[ "$commit" =~ ^feat\( ]]; then
            if [ "$bump_type" != "major" ]; then
                bump_type="minor"
            fi
        # Check for fixes and other patch-level changes
        elif [[ "$commit" =~ ^(fix|perf|refactor|style): ]] || [[ "$commit" =~ ^(fix|perf|refactor|style)\( ]]; then
            if [ "$bump_type" != "major" ] && [ "$bump_type" != "minor" ]; then
                bump_type="patch"
            fi
        fi
    done <<< "$commits"
    
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
    local commits="$2"
    local date=$(date +%Y-%m-%d)
    
    # Create changelog content
    local changelog_content="## [$version] - $date\n\n"
    
    # Categorize commits
    local features=""
    local fixes=""
    local other=""
    
    while IFS= read -r commit; do
        if [[ "$commit" =~ ^feat ]]; then
            features="$features- $commit\n"
        elif [[ "$commit" =~ ^fix ]]; then
            fixes="$fixes- $commit\n"
        elif [[ "$commit" =~ ^(perf|refactor|style): ]]; then
            other="$other- $commit\n"
        fi
    done <<< "$commits"
    
    if [ -n "$features" ]; then
        changelog_content="$changelog_content### 🚀 Features\n$features\n"
    fi
    
    if [ -n "$fixes" ]; then
        changelog_content="$changelog_content### 🐛 Bug Fixes\n$fixes\n"
    fi
    
    if [ -n "$other" ]; then
        changelog_content="$changelog_content### 📝 Other Changes\n$other\n"
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
    
    # Get commits since last tag
    commits=$(get_commits_since_tag)
    
    if [ -z "$commits" ]; then
        echo "ℹ️  No new commits found since last tag"
        return 0
    fi
    
    echo "📝 Analyzing commits:"
    echo "$commits" | head -5
    if [ $(echo "$commits" | wc -l) -gt 5 ]; then
        echo "   ... and $(( $(echo "$commits" | wc -l) - 5 )) more"
    fi
    echo ""
    
    # Analyze commits to determine bump type
    bump_type=$(analyze_commits "$commits")
    
    if [ "$bump_type" = "none" ]; then
        echo "ℹ️  No releasable changes found"
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
    update_changelog "$new_version" "$commits"
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
