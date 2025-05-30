#!/bin/bash

# Script to update README version line automatically
# Usage: ./scripts/update-readme-version.sh [version]

set -e

# Get version from argument or package.json
if [ -n "$1" ]; then
    VERSION="$1"
else
    # Extract version from package.json
    VERSION=$(node -p "require('./package.json').version")
fi

# Check if version is valid
if [ -z "$VERSION" ]; then
    echo "❌ Error: No version provided and none found in package.json"
    exit 1
fi

echo "📝 Updating README.md with version: $VERSION"

# Update the README.md file
if [ -f "README.md" ]; then
    # Use sed to replace the version line
    # This handles both empty version lines and existing versions
    sed -i.bak "s/^Current Version: .*/Current Version: **V$VERSION**/" README.md
    
    # Remove backup file
    rm -f README.md.bak
    
    echo "✅ README.md updated successfully with version V$VERSION"
else
    echo "❌ Error: README.md not found in current directory"
    exit 1
fi
