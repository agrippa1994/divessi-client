# Publishing to npm

`divessi-client` is a single npm package with ESM and CommonJS entry points. GitHub Actions runs the release pipeline; npm hosts the package. Both formats share one version from `package.json`.

## One-time setup

1. If the package does not yet exist on npm, a maintainer must publish the initial version interactively. From a clean, reviewed checkout, run `pnpm install --frozen-lockfile`, `pnpm check`, `pnpm test`, `pnpm test:package`, then `npm login` and `npm publish --access public`. Use your npm account's interactive authentication. Do not add an npm publishing token to GitHub. If the name is unavailable, choose a name you control and update package imports and changesets before publishing.
2. In the npm package settings, add a GitHub Actions trusted publisher with owner `agrippa1994`, repository `divessi-client`, workflow filename `release.yml`, and no environment. Allow direct `npm publish`; Changesets does not use npm's staged publishing flow. Complete the first automated publish within npm's activation window (currently two days), recreating the publisher configuration if it expires.
3. Enable **Settings → Actions → General → Allow GitHub Actions to create and approve pull requests**. Protect `main` with review requirements and the CI `Validate` check.
4. For CI to run automatically on bot-created release PRs, supply `RELEASE_PR_TOKEN` from a GitHub App or a scoped account with repository contents and pull-request write access. The default `GITHUB_TOKEN` can open the release PR, but GitHub suppresses workflows triggered by its pushes. Without the optional token, manually run the **CI** workflow on the release PR's branch before merging; do not bypass required checks.

The workflow uses GitHub-hosted runners, the Node version in `.node-version`, and the pnpm version in `package.json`. Changesets uses pnpm's native publisher, which supports OIDC and automatically attaches provenance for public packages from public repositories. The interactive bootstrap uses npm (at least 11.5.1 for npm's own OIDC support). Configure npm to require 2FA and disallow token publishing after verifying OIDC works. See [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/), [pnpm publishing](https://pnpm.io/cli/publish), [Changesets automation](https://changesets.dev/guide/automating), and [GitHub workflow trigger restrictions](https://docs.github.com/en/actions/how-tos/writing-workflows/choosing-when-your-workflow-runs/triggering-a-workflow#triggering-a-workflow-from-a-workflow).

## Normal releases

1. Implement a change, run `pnpm changeset`, choose the release type, and describe the user-visible behavior. Commit the generated `.changeset/*.md` with the change. For changes that need no release, an empty changeset (`pnpm changeset --empty`) records that intent.
2. Merge the reviewed change into `main`. The release workflow builds, checks formatting and types, runs mocked tests, installs the npm archive in isolation, and checks ESM/CommonJS consumption before doing release work.
3. Changesets opens or updates **chore: version packages** with version bumps, `CHANGELOG.md`, and consumed changesets removed. `pnpm release:version` also refreshes the lockfile. Review the release PR and merge it.
4. With no pending changesets, the workflow packs the validated source in a job without publishing permissions, then publishes those archives in a separate job with OIDC. It skips package versions already present on npm and creates version tags and GitHub releases from the changelog.

Use patch for compatible fixes and documentation/examples; minor for compatible features; major for breaking changes at 1.0 and above. Before 1.0, use minor for breaking changes and document migration steps. Do not edit versions manually or reuse an already published version. Consumers install with `pnpm add divessi-client` (or `npm install divessi-client`).

PR validation uses read-only permissions. Only the version job can create PRs; only the publishing job can request npm OIDC credentials. Third-party actions are pinned to commit SHAs and Dependabot proposes action updates. Releases use frozen dependencies without shared caches and serialize so an in-flight publish is never cancelled.

## Failed runs and prereleases

Fix the failure and rerun **Release** on `main` using `workflow_dispatch`. Registry versions are immutable; Changesets skips published versions rather than overwriting them. If npm publication succeeded but a later GitHub release/tag step failed, verify the npm version and create the missing GitHub tag/release at the original release commit; reruns may skip release creation for an already published version. Publish a new patch for package corrections rather than deleting or replacing versions.

For a coordinated prerelease, use `pnpm changeset pre enter next`, add changesets, and review the generated prerelease version PR. Changesets publishes prereleases under `next`, leaving `latest` unchanged. When ready, run `pnpm changeset pre exit`, commit the state change, and review the stable release PR. Do not use snapshot versions for stable releases.
