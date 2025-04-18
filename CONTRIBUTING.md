# Contributing

## Release

1. Run `yarn build`

2. Update CHANGELOG.md according to the Major / Minor / Patch semver convention.

3. Based on semver upgrade the package version in `package.json`.

4. Commit the changes and create a PR named "🔖(release) version package".

5. Ask for approval, once the PR is approved, merge it.

6. Once merged, run `npx @changesets/cli publish`. It will publish the new version of the package to NPM and create a git tag.

7. Run `git push origin <TAG>`

8. Tell everyone 🎉 !
