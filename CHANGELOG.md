# [1.1.0](https://github.com/jagoanbunda/mobile/compare/v1.0.1...v1.1.0) (2026-02-04)


### Bug Fixes

* add android.package for EAS build compatibility ([efca94f](https://github.com/jagoanbunda/mobile/commit/efca94f59cd0c0c01af06fcadc970625de124d8c))
* add EAS login verification step for EXPO_TOKEN ([b6c583e](https://github.com/jagoanbunda/mobile/commit/b6c583e23cb21a3d181660d22d09c2c14d019061))
* add safe area insets to bottom tab bar to prevent overlap with Android navigation ([7338002](https://github.com/jagoanbunda/mobile/commit/7338002c985d2fae56813bf642d164b4886de93d))
* **auth:** resolve infinite loading loop after login ([81f451a](https://github.com/jagoanbunda/mobile/commit/81f451a68f89c1b43472c4cfce53827d8292e888))
* **food-logs:** properly reconstruct Food objects when initializing edit form ([756f0f7](https://github.com/jagoanbunda/mobile/commit/756f0f74305bb1fe5c0aec4585652f89a31c173e))
* improve light theme contrast and make home screen theme-aware ([22d7e2a](https://github.com/jagoanbunda/mobile/commit/22d7e2ad81b34b02cb746d55e50f0136e3c4019c))
* **input:** add history nav button and fix VirtualizedList nesting ([efe60cb](https://github.com/jagoanbunda/mobile/commit/efe60cba4b8bab2d39a92ecf12009064513e3dd3))
* **screening:** check error state before loading state ([d3bdb05](https://github.com/jagoanbunda/mobile/commit/d3bdb0573a1c1d54bd7e8466bba2d60dd2720f6f))
* **screening:** prevent mutation retry loop after 422 error ([25afebe](https://github.com/jagoanbunda/mobile/commit/25afebe03fe5205494c9e8a1725096f8c7f5af04))
* **screening:** show friendly error when no questionnaire for child's age ([ac9f5e8](https://github.com/jagoanbunda/mobile/commit/ac9f5e83f0b1f98c56d10c6e3ca50f6f5f820119))
* **screening:** use ref to prevent double mutation calls ([89e0dc8](https://github.com/jagoanbunda/mobile/commit/89e0dc83a49ff666c3d9ce09ffe5194c9fbb31f9))
* update EAS project ID to correct value ([ea0f2e1](https://github.com/jagoanbunda/mobile/commit/ea0f2e11864e693932be46da08f9eeb713b739c9))
* Update navigation ([a1db23c](https://github.com/jagoanbunda/mobile/commit/a1db23c7a9c986aa670e8226b1732f94b4e92421))
* Update styles and layout ([3c1114b](https://github.com/jagoanbunda/mobile/commit/3c1114b8e76a94f1ab2b8982c9becf2f98f11b09))
* use EAS cloud build instead of local build ([e966c72](https://github.com/jagoanbunda/mobile/commit/e966c721fc137845ad2deafabebd604e65825e64))


### Features

* add auth guard, photo upload, and date picker for child profiles ([5c6f785](https://github.com/jagoanbunda/mobile/commit/5c6f785448eafdc419c0c403f1de0ba03819b2a1))
* add authentication context ([3373500](https://github.com/jagoanbunda/mobile/commit/3373500878f1bc00399b4d4088b7da683aaacbd3))
* Add child development data ([dd8931f](https://github.com/jagoanbunda/mobile/commit/dd8931f8cfc169c72b6007895128caa766ea36d8))
* add food logs, anthropometry history, and notifications screens ([26056e1](https://github.com/jagoanbunda/mobile/commit/26056e1a5dad4fd29ee1e66c59eda1b7d8a6a269))
* add getAvatarUrl helper for constructing full avatar URLs ([a47ec39](https://github.com/jagoanbunda/mobile/commit/a47ec39cbb7eee5cc57749b32c5cdef4e53a39fd))
* add light/dark theme toggle with persistence ([2f196d8](https://github.com/jagoanbunda/mobile/commit/2f196d86953da5063cb10ef6133b7fd76253b1f8))
* Add recommendations ([6d4b7a1](https://github.com/jagoanbunda/mobile/commit/6d4b7a123e12ad73d02ea30d0cd3985a24bb159a))
* add supporting infrastructure for services, types, and utilities ([e6b4110](https://github.com/jagoanbunda/mobile/commit/e6b41106329a06018b65a81821f7561066e31d14))
* add UI components for food logging and authentication ([0d8a0b5](https://github.com/jagoanbunda/mobile/commit/0d8a0b5edd31224a7c94ab96b0b65e3d34263c97))
* **anthropometry:** add edit mode support to input form ([b3df527](https://github.com/jagoanbunda/mobile/commit/b3df5274aa32cdf4f1cf51c9892590444129f6ad))
* **anthropometry:** integrate growth-chart with real API data ([ebab568](https://github.com/jagoanbunda/mobile/commit/ebab5689f983a82f24deb3367de0d860fa51eded))
* **api:** add postMultipart method for file uploads ([3f67031](https://github.com/jagoanbunda/mobile/commit/3f67031874fc98fc783c8a6261135efccb47de34))
* **auth:** add ProtectedRoute component with focus verification ([eb8b214](https://github.com/jagoanbunda/mobile/commit/eb8b214f686c2f2a202e6a9a037183196decea46))
* **auth:** add token refresh and verifyAuth to AuthContext ([23f3fd0](https://github.com/jagoanbunda/mobile/commit/23f3fd0e88b4743c8b51f26681562ca5fc376a01))
* **auth:** connect login screen to API with validation ([289a846](https://github.com/jagoanbunda/mobile/commit/289a846bdb06c0a8e67585a13d53efee52a6bbf1))
* **auth:** connect register screen to API with validation ([c6fb045](https://github.com/jagoanbunda/mobile/commit/c6fb0457d03ab00b5e47462ecd7e6487d5361300))
* **children:** add createWithAvatar and updateWithAvatar for file uploads ([985881e](https://github.com/jagoanbunda/mobile/commit/985881ef514fd23a869471ca652a0352cc37638a))
* **ci:** integrate semantic-release for automatic versioning ([8beb92b](https://github.com/jagoanbunda/mobile/commit/8beb92b91137cd70dd5960fa7769d8fbce5d4cfe))
* configure EAS project as JagoanBunda ([a67921d](https://github.com/jagoanbunda/mobile/commit/a67921d25482efa4714ebda163b6e98ba47a1dc8))
* **edit-child:** use updateWithAvatar for file upload ([f977912](https://github.com/jagoanbunda/mobile/commit/f977912976fcc6468b97fde4c0a12ecbe5d87e31))
* Implement result screen ([616fc57](https://github.com/jagoanbunda/mobile/commit/616fc572849fc8b4d06b45325feec59b74ec7b21))
* Initial implementation ([c132f0b](https://github.com/jagoanbunda/mobile/commit/c132f0b91b87d668d6e049f0e5f4d24ef94df85e))
* merge release and build workflows into single workflow ([7e0dd3c](https://github.com/jagoanbunda/mobile/commit/7e0dd3cfd7fd5cae3395f362cfb763bc0818d505))
* **pmt:** connect PMT screens to API hooks ([fb68978](https://github.com/jagoanbunda/mobile/commit/fb68978313de869ed46de6453894d876d4c4798c))
* replace mock data with real API data in dashboard, progress, and parent edit screens ([93522c5](https://github.com/jagoanbunda/mobile/commit/93522c525de7f4f3baff552292253c71a5d02494))
* **routes:** add edit food log and nutrition dashboard screens ([5ccc569](https://github.com/jagoanbunda/mobile/commit/5ccc56963c324e9e35922ca158e01dbd0b6bfe86))
* **screening:** integrate ASQ-3 screens with real API ([3d5ddf2](https://github.com/jagoanbunda/mobile/commit/3d5ddf27560d843afe96d87a3156c980296b0bc2))
* switch to local build on GitHub Actions ([7cf6d3a](https://github.com/jagoanbunda/mobile/commit/7cf6d3abbce60d05cae5c4ba7709d0f98bc5da1e))
* **ui:** update input screen with date picker and nutrition table ([0138d7f](https://github.com/jagoanbunda/mobile/commit/0138d7fbcd4679757235b1166f4cb3bacca9a906))

# Changelog

## v1.0.1 (2026-02-04)

## What's Changed
- fix(screening): check error state before loading state (d3bdb05)
- chore(screening): remove console.error for expected 422 errors (9120b19)
- fix(screening): use ref to prevent double mutation calls (89e0dc8)
- fix(screening): prevent mutation retry loop after 422 error (25afebe)
- fix(screening): show friendly error when no questionnaire for child's age (ac9f5e8)
- chore(dev): add Reactotron for API debugging (e7445af)
- feat(screening): integrate ASQ-3 screens with real API (3d5ddf2)
- feat(pmt): connect PMT screens to API hooks (fb68978)
- test(pmt): add unit tests for PMT screens (TDD RED) (2db7dd2)
- chore(release): update changelog [skip ci] (60239df)
## Downloads
- 📱 **Android APK** - Download from assets below

## v1.0.1 (2026-01-29)

## What's Changed
- test(children): add unit tests for avatar upload methods (6d3b015)
- feat(edit-child): use updateWithAvatar for file upload (f977912)
- feat(children): add createWithAvatar and updateWithAvatar for file uploads (985881e)
- feat(api): add postMultipart method for file uploads (3f67031)
- feat(anthropometry): integrate growth-chart with real API data (ebab568)
- feat(anthropometry): add edit mode support to input form (b3df527)
- feat: add getAvatarUrl helper for constructing full avatar URLs (a47ec39)
- feat: replace mock data with real API data in dashboard, progress, and parent edit screens (93522c5)
- fix(auth): resolve infinite loading loop after login (81f451a)
- chore(deps): add @types/jest for TypeScript support in tests (e68dd4b)
- feat(auth): connect register screen to API with validation (c6fb045)
- feat(auth): connect login screen to API with validation (289a846)
- feat(auth): add ProtectedRoute component with focus verification (eb8b214)
- feat(auth): add token refresh and verifyAuth to AuthContext (23f3fd0)
- chore(test): setup Jest test infrastructure (d0958d5)
- fix(food-logs): properly reconstruct Food objects when initializing edit form (756f0f7)
- feat(routes): add edit food log and nutrition dashboard screens (5ccc569)
- chore(release): update changelog [skip ci] (1dd0699)
## Downloads
- 📱 **Android APK** - Download from assets below

## v1.0.1 (2026-01-28)

## What's Changed
- feat: add authentication context (3373500)
- feat: add supporting infrastructure for services, types, and utilities (e6b4110)
- feat: add UI components for food logging and authentication (0d8a0b5)
- docs: add project documentation (b42c1cc)
- chore: update .gitignore with env and tooling ignores (7723795)
- feat: add food logs, anthropometry history, and notifications screens (26056e1)
- fix(input): add history nav button and fix VirtualizedList nesting (efe60cb)
- feat: add auth guard, photo upload, and date picker for child profiles (5c6f785)
- chore: add /docs to gitignore (a624ea3)
- chore(release): update changelog [skip ci] (d66038e)
## Downloads
- 📱 **Android APK** - Download from assets below

## v1.0.1 (2025-12-17)

## What's Changed
- ci: rename APK with version and build number (709086a)
- chore(release): update changelog [skip ci] (472c721)
## Downloads
- 📱 **Android APK** - Download from assets below

## v1.0.1 (2025-12-17)

## What's Changed
- docs: add app screenshots and update README (9ac0204)
- chore(release): update changelog [skip ci] (5f6a28b)
## Downloads
- 📱 **Android APK** - Download from assets below

## v1.0.1 (2025-12-17)

## What's Changed
- feat(ui): update input screen with date picker and nutrition table (0138d7f)
- chore(release): update changelog [skip ci] (750da2d)
## Downloads
- 📱 **Android APK** - Download from assets below

## v1.0.1 (2025-12-16)

## What's Changed
- feat: Implement result screen (616fc57)
- feat: Add child development data (dd8931f)
- fix: Update navigation (a1db23c)
- feat: Add recommendations (6d4b7a1)
- fix: Update styles and layout (3c1114b)
- feat: Initial implementation (c132f0b)
## Downloads
- 📱 **Android APK** - Download from assets below

## v1.0.1 (2025-12-16)

## What's Changed
- fix: add safe area insets to bottom tab bar to prevent overlap with Android navigation (7338002)
- chore(release): update changelog [skip ci] (12bc25e)
## Downloads
- 📱 **Android APK** - Download from assets below

## v1.0.1 (2025-12-16)

## What's Changed
- feat: switch to local build on GitHub Actions (7cf6d3a)
- fix: use EAS cloud build instead of local build (e966c72)
- fix: add android.package for EAS build compatibility (efca94f)
- fix: update EAS project ID to correct value (ea0f2e1)
- feat: configure EAS project as JagoanBunda (a67921d)
- ci: include workflow files in CI/CD trigger paths (656f8c5)
- fix: add EAS login verification step for EXPO_TOKEN (b6c583e)
- style: add spacing between header and content in PMT screen (7c72cc7)
- feat: merge release and build workflows into single workflow (7e0dd3c)
## Downloads
- 📱 **Android APK** - Download from assets below


### Bug Fixes

* remove paths-ignore to fix workflow syntax error ([551cec2](https://github.com/jagoanbunda/mobile/commit/551cec25c016a70ebbd58cb43e639ef5010f6c6b))

# 1.0.0 (2025-12-16)


### Features

* implement dark theme UI with tab navigation and CI/CD setup ([e9fd0fa](https://github.com/jagoanbunda/mobile/commit/e9fd0fa70214bdf2557471f4b4e16f76c9f1fa4b))
