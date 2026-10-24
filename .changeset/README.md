# Releases

Run `pnpm changeset` for a user-facing change and commit the generated Markdown file with the change. Choose patch for compatible fixes, minor for compatible features, and major for breaking changes. While the package is below 1.0, use minor for breaking changes and describe the migration explicitly.

Automation collects these files into a release pull request. Review the version and changelog, then merge to publish. See [RELEASING.md](../RELEASING.md) for initial npm setup and recovery.
