# Simplified Pre-release Development Workflow

This project uses a simplified two-branch workflow with pre-releases for development and stable releases for production.

## Branch Structure

- **`main`**: Production-ready code. Stable releases are created from this branch (e.g., `v1.2.0`, `v1.3.0`)
- **`dev`**: Development branch where all feature work happens. Pre-releases are created here (e.g., `v1.2.0-dev.1`, `v1.2.0-dev.2`)

## Workflow

### Development Process

1. **Work on the `dev` branch**: All development happens here
2. **Use conventional commits**: Follow the commit message format  
3. **Automatic pre-releases**: Every significant commit creates a pre-release version
4. **Manual promotion**: When ready, promote pre-releases to stable releases

### Commit Message Format

Use conventional commit messages to trigger automatic pre-releases:

```bash
# Patch pre-release (v1.0.0-dev.1 -> v1.0.1-dev.1)
fix: resolve login validation issue
perf: improve database query performance
refactor: simplify user authentication logic
style: update button styling consistency

# Minor pre-release (v1.0.0-dev.1 -> v1.1.0-dev.1)  
feat: add user profile dashboard
feat: implement email notifications

# Major pre-release (v1.0.0-dev.1 -> v2.0.0-dev.1)
feat!: redesign authentication system
feat: update API endpoints

BREAKING CHANGE: authentication endpoints have changed
```

### Automatic Pre-release Process

When you push commits to `dev` that contain:
- `feat:` (new features) → Creates **minor** pre-release
- `fix:`, `perf:`, `refactor:`, `style:` → Creates **patch** pre-release  
- `BREAKING CHANGE:` or `feat!:` → Creates **major** pre-release

The system will automatically:
1. 🔍 Analyze your commits
2. 📦 Create a pre-release version (e.g., `v1.2.0-dev.3`)
3. 🏷️ Create a git tag with the pre-release version
4. 📝 Generate release notes for the pre-release

### Promoting Pre-releases to Stable

When you're ready to release a stable version, you have two options:

#### Option 1: Manual Workflow Dispatch
1. Go to GitHub Actions → "Promote to Stable Release" 
2. Click "Run workflow"
3. Select the promotion type (usually "stable")
4. The workflow will create a PR from `dev` to `main`
5. Review and merge the PR to create the stable release

#### Option 2: Automatic via Commit Message
Add `[promote]` to your commit message on `dev`:
```bash
git commit -m "feat: ready for stable release [promote]"
```
This will automatically trigger the promotion workflow.

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

## Version Examples

Here's how the versioning works in practice:

### Development on `dev` branch:
```bash
# Start with v1.0.0 on both branches
git checkout dev

# Add a feature
git commit -m "feat: add user dashboard"
# → Creates pre-release: v1.1.0-dev.1

# Fix a bug  
git commit -m "fix: resolve login issue"
# → Creates pre-release: v1.1.0-dev.2

# Add another feature
git commit -m "feat: implement notifications"  
# → Creates pre-release: v1.2.0-dev.1
```

### Promotion to stable:
```bash
# When ready for stable release
git commit -m "docs: update changelog [promote]"
# → Creates PR: dev → main
# → After merge: Creates stable release v1.2.0 on main
```

## Benefits

- ✨ **Simplified**: Only two branches to manage
- 🧪 **Testing**: Pre-releases allow testing before stable 
- 🔄 **Continuous**: Every commit creates a versioned pre-release
- 📝 **Consistent**: Semantic versioning with generated changelogs
- 🚀 **Flexible**: Manual control over when to promote to stable
- 🔒 **Safe**: All promotions go through PR validation
- 👥 **Team-friendly**: Clear distinction between dev/stable versions

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
