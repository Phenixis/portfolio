#!/bin/bash

# Script to manually update README version line
# Usage: ./scripts/update-readme-version.sh [version]
# If no version is provided, it will use the current package.json version

set -e

# Get version from argument or package.json
if [ -n "$1" ]; then
    VERSION="$1"
else
    # Extract version from package.json
    VERSION=$(node -p "require('./package.json').version" 2>/dev/null || echo "")
fi

# Check if version is valid
if [ -z "$VERSION" ]; then
    echo "❌ Error: No version provided and none found in package.json"
    echo "Usage: $0 [version]"
    echo "Example: $0 1.2.0"
    exit 1
fi

echo "📝 Updating README.md with version: $VERSION"

# Update the README.md file
if [ -f "README.md" ]; then
    # Use sed to replace the version line (compatible with both GNU and BSD sed)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS (BSD sed)
        sed -i '' "s/^Current Version: .*/Current Version: **V$VERSION**/" README.md
    else
        # Linux (GNU sed)
        sed -i "s/^Current Version: .*/Current Version: **V$VERSION**/" README.md
    fi
    
    echo "✅ README.md updated successfully with version V$VERSION"
    echo "💡 Don't forget to commit this change if you want to include it in your release"
else
    echo "❌ Error: README.md not found in current directory"
    exit 1
fi
