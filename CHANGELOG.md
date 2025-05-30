# Changelog

All notable changes to this project will be documented in this file.

## [0.2.0-V1.0.0.1](https://github.com/Phenixis/life_os/compare/v0.1.0...v0.2.0-V1.0.0.1) (2025-05-30)

### chore

* **release:** 0.1.1-dev.1 [skip ci] ([](https://github.com/Phenixis/life_os/commit/138e93d289e49d5728f4054d795c14696f71fa1c))

### feat

* add automatic README version updates ([](https://github.com/Phenixis/life_os/commit/9997bb5e821c081e4d04396827468ce4e129c6b5))

### fix

* enhance semantic-release configuration for better commit message handling and error reporting ([](https://github.com/Phenixis/life_os/commit/96458073003e61d4e2ad4b0d978660f879fc368a))
* optimize semantic-release configuration to handle large commit history ([](https://github.com/Phenixis/life_os/commit/766559c2ac5296e5201c56e427410b027b649704))
* resolve semantic-release JSON syntax error and optimize release configuration ([](https://github.com/Phenixis/life_os/commit/30a7680b3c12e5949b23f86dd384c1b1b2f7d914))
* resolve semantic-release prerelease branch conflict ([](https://github.com/Phenixis/life_os/commit/40656824d4848971bfb38c804d0df3dd4bbe7e3a))
* update .env.example and pre-push script for improved environment handling ([](https://github.com/Phenixis/life_os/commit/7824ed3cdd4263a7a0ef526bd4e6e3d45d16df48))

## [0.1.1-dev.1](https://github.com/Phenixis/life_os/compare/v0.1.0...v0.1.1-dev.1) (2025-05-30)

### fix

* enhance semantic-release configuration for better commit message handling and error reporting ([](https://github.com/Phenixis/life_os/commit/96458073003e61d4e2ad4b0d978660f879fc368a))
* optimize semantic-release configuration to handle large commit history ([](https://github.com/Phenixis/life_os/commit/766559c2ac5296e5201c56e427410b027b649704))
* resolve semantic-release JSON syntax error and optimize release configuration ([](https://github.com/Phenixis/life_os/commit/30a7680b3c12e5949b23f86dd384c1b1b2f7d914))
* update .env.example and pre-push script for improved environment handling ([](https://github.com/Phenixis/life_os/commit/7824ed3cdd4263a7a0ef526bd4e6e3d45d16df48))

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Semantic release automation with conventional commits
- Husky pre-commit hooks for code quality
- Three-stage environment setup (development → preview → production)
- Automated changelog generation
- Commit message validation with commitlint

### Changed
- Enhanced development workflow with automated versioning
- Improved code quality checks before commits

### Infrastructure
- GitHub Actions workflows for CI/CD
- Semantic release configuration for multi-branch releases
- Pre-commit hooks for type checking, linting, and building
