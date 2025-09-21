# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.7.2] - 2023-04-21

### Added

- Added `APP_ROOT` global variable.

## [0.7.3] - 2023-06-04

### Added

- Enabled [Semgrep](https://semgrep.dev) SAST analyzer.

## [0.7.4] - 2023-10-02

### Updated

- Main documentation (new section)
- Development dependencies

## [0.8.0] - 2023-11-06

### Added

- Differentiate app/router errors (added `RouterError`)

### Updated

- Renamed class `Common` >> `Utils`
- Replaced coveralls w/ [coverage-reporter](https://github.com/coverallsapp/coverage-reporter)
- Package node engine to AWS supported (v18)

## [0.8.1] - 2023-02-28

### Updated

- Replaced Travis-CI with Github workflow
- Added comments to `router.use` @example

## [0.8.2] - 2024-04-26

### Added

- `exports.js` to consolidate interfaces used in plugin tests

### Updated

- Minor refactor, clear up test gaps
- Resolved Instanbul warnings (100%)
- Replaced JSDoc theme [minami](https://github.com/Nijikokun/minami) with [clean-jsdoc-theme](https://github.com/ankitskvmdam/clean-jsdoc-theme)

## [0.8.3] - 2024-06-13

### Updated

- Upgraded [clean-jsdoc-theme](https://github.com/ankitskvmdam/clean-jsdoc-theme) (bug fixes)
- Upgraded outdated NPM `devDependencies`

## [0.8.4] - 2024-09-02

- Upgraded outdated NPM packages

## [0.8.5] - 2024-12-01

- NPM security update (CVE-2024-21538)
- Upgraded outdated NPM packages

## [0.8.6] - 2025-08-17

- Upgraded outdated NPM packages

## [0.8.7] - 2025-09-21

- Support `async` use in default() route
- Replaced ESLint deprecated release
