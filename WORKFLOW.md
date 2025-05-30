# Simplified Development Workflow

This project uses a simplified two-branch workflow for development and releases.

## Branch Structure

- **`main`**: Production-ready code. All releases are created from this branch.
- **`dev`**: Development branch where all feature work happens.

## Workflow

### Development Process

1. **Work on the `dev` branch**: All development happens here
2. **Use conventional commits**: Follow the commit message format
3. **Automatic releases**: When certain commits are pushed to `dev`, an automated process handles the release

### Commit Message Format

Use conventional commit messages to trigger automatic releases:

```bash
# Patch release (v1.0.0 -> v1.0.1)
fix: resolve login validation issue
perf: improve database query performance
refactor: simplify user authentication logic
style: update button styling consistency

# Minor release (v1.0.0 -> v1.1.0)  
feat: add user profile dashboard
feat: implement email notifications

# Major release (v1.0.0 -> v2.0.0)
feat!: redesign authentication system
feat: update API endpoints

BREAKING CHANGE: authentication endpoints have changed
```

### Automatic Release Process

When you push commits to `dev` that contain:
- `feat:` (new features) → Creates **minor** release
- `fix:`, `perf:`, `refactor:`, `style:` → Creates **patch** release  
- `BREAKING CHANGE:` or `feat!:` → Creates **major** release

The system will automatically:
1. 🔍 Analyze your commits
2. 📝 Create a pull request from `dev` to `main`
3. ✅ Run all validation checks
4. 🔀 Auto-merge the PR if checks pass
5. 🚀 Trigger semantic-release to create the actual release with changelog
6. 🏷️ Create a git tag with the new version
7. 📦 Publish release notes on GitHub

### Manual Steps (If Needed)

If auto-merge fails due to conflicts or failed checks:
1. The PR will remain open for manual review
2. Fix any issues in the `dev` branch
3. Push the fixes (this will update the existing PR)
4. Manually merge the PR when ready

## Getting Started

Run the setup script to configure your local environment:

```bash
./scripts/setup-simplified-workflow.sh
```

This will:
- Create the `dev` branch if it doesn't exist
- Set up your local git configuration
- Provide guidance on cleaning up old branches

## Benefits

- ✨ **Simplified**: Only two branches to manage
- 🤖 **Automated**: Releases happen automatically based on commit messages
- 📝 **Consistent**: Semantic versioning with generated changelogs
- 🚀 **Fast**: No manual release process
- 🔒 **Safe**: All changes go through PR validation

## Troubleshooting

### Auto-PR Not Created
- Ensure your commits follow conventional commit format
- Check that you're pushing to the `dev` branch
- Verify the commit message contains `feat:`, `fix:`, etc.

### Auto-Merge Failed
- Check the PR for failed status checks
- Fix issues in the `dev` branch and push again
- The existing PR will be updated automatically

### Need to Skip Release
- Use commits that don't trigger releases: `docs:`, `test:`, `chore:`
- Or add `(no-release)` scope: `feat(no-release): internal update`
