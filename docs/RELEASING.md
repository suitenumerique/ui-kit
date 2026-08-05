# Manual package releases

The packages in this repository have independent versions and are published
manually. There is no publication workflow in GitHub Actions. Changesets is
used locally to calculate versions and update changelogs; npm is invoked for
one explicit workspace at a time.

## Release model

Three separate states must agree for every release:

1. the version in the package's `package.json` and `CHANGELOG.md`;
2. the version published on npm;
3. the package-specific Git tag and GitHub Release.

GitHub does not assign npm versions. The package manifest is the source of the
npm version, npm `dist-tags` identify the stable version of each package, and
GitHub Releases document the corresponding repository commit.

Package tags use the Changesets monorepo convention:

```text
@gouvfr-lasuite/ui-components@1.1.0
@gouvfr-lasuite/ui-tokens@1.0.1
@gouvfr-lasuite/ui-codemod@1.0.1
```

Do not run `changeset publish`, `npm publish --workspaces` or a recursive
workspace publication command. They can publish more packages than intended.

`@gouvfr-lasuite/ui-codemod` is published only to distribute its one-off CLI
through npx. It is not an application dependency and exposes no JavaScript
import API. Every codemod release pull request must update the exact version in
the documented `npx @gouvfr-lasuite/ui-codemod@<version>` commands.

## Prerequisites

- Node 24 (the version pinned in `.nvmrc`) and Yarn 1.22.22 — `changeset` needs
  a Node release that can `require()` an ESM module;
- a clean checkout with an up-to-date `origin/main`;
- an npm account allowed to publish the `@gouvfr-lasuite` scope;
- npm two-factor authentication in `auth-and-writes` mode;
- an authenticated GitHub CLI (`gh auth status`).

Check npm authentication before preparing a publication:

```bash
npm whoami
```

Local publications do not generate npm provenance. Provenance will be enabled
when publishing moves to a dedicated OIDC-enabled CI workflow.

## Add release intent to a functional pull request

Every functional pull request that should produce a release must include a
changeset:

```bash
yarn changeset
```

Select each affected package, choose `patch`, `minor` or `major`, and write a
consumer-facing summary. A components-only changeset looks like this:

```md
---
"@gouvfr-lasuite/ui-components": minor
---

Add the FilePicker component.
```

Changesets are authored release intent. They do not change package versions or
publish anything by themselves.

## Prepare a release for one package

Create a release branch from the latest remote main branch:

```bash
git fetch origin
git switch -c release/ui-components-1.1.0 origin/main
yarn changeset status
```

Version only `ui-components` by ignoring the two other packages:

```bash
yarn changeset version \
  --ignore @gouvfr-lasuite/ui-tokens \
  --ignore @gouvfr-lasuite/ui-codemod
```

Review the diff. The release pull request should contain the selected package
version and changelog, consumed changesets, and only the internal dependency
updates required by Changesets.

Use the equivalent ignore combinations for the other packages:

```bash
# ui-tokens only
yarn changeset version \
  --ignore @gouvfr-lasuite/ui-components \
  --ignore @gouvfr-lasuite/ui-codemod

# ui-codemod only
yarn changeset version \
  --ignore @gouvfr-lasuite/ui-components \
  --ignore @gouvfr-lasuite/ui-tokens
```

Do not force a dependent package into `--ignore` when Changesets requires an
internal dependency range update. For example, `ui-components` currently
depends on `ui-tokens` through `^1.0.0`: token versions within that range can be
released alone, while a change outside that range may require a components
release as well.

A changeset that mixes ignored and selected packages must be split, or all of
its packages must be released together.

## Prepare a release for several or all packages

To release two related packages, ignore only the package that is not part of
the release. For example, for tokens and components:

```bash
yarn changeset version --ignore @gouvfr-lasuite/ui-codemod
```

To release every package described by pending changesets:

```bash
yarn version-packages
```

Versions remain independent. The same release pull request may therefore
contain `ui-tokens@1.1.0`, `ui-components@1.0.1` and `ui-codemod@1.1.0`.

Merge the release pull request before publishing. Do not create commits between
the merged release commit, npm publication and tag creation.

## Validate the merged release commit

Start from a clean, current main branch:

```bash
git switch main
git pull --ff-only
git status --short
npm whoami
```

`git status --short` must print nothing. Run the complete release validation:

```bash
yarn install --frozen-lockfile
yarn lint
yarn build
yarn test
yarn test:ct
yarn build-storybook
```

## Preview and publish one package

The examples below publish `ui-components`; replace the workspace and version
for another package.

Confirm that the target version does not already exist:

```bash
npm view "@gouvfr-lasuite/ui-components@1.1.0" version
```

An npm `E404` is expected for a new version. Inspect the exact publication
without modifying the registry:

```bash
npm publish \
  --dry-run \
  --workspace="@gouvfr-lasuite/ui-components" \
  --access public \
  --tag latest
```

Publish the workspace only after reviewing the dry-run file list:

```bash
npm publish \
  --workspace="@gouvfr-lasuite/ui-components" \
  --access public \
  --tag latest
```

npm prompts for the 2FA code interactively. Do not pass an OTP in the command
line or store it in shell history.

Verify the published version and its per-package stable dist-tag:

```bash
npm view "@gouvfr-lasuite/ui-components@1.1.0" version
npm view "@gouvfr-lasuite/ui-components" dist-tags --json
```

## Publish several packages

Publish packages sequentially so failures are visible and internal dependencies
are available before their consumers. For a release of all three packages:

```bash
npm publish \
  --workspace="@gouvfr-lasuite/ui-tokens" \
  --access public \
  --tag latest

npm publish \
  --workspace="@gouvfr-lasuite/ui-components" \
  --access public \
  --tag latest

npm publish \
  --workspace="@gouvfr-lasuite/ui-codemod" \
  --access public \
  --tag latest
```

Verify each package with `npm view` before continuing to the next package.
Publication is not transactional: if tokens succeeds and components fails,
tokens remains published. Fix and retry only the package that failed. A version
accepted by npm is immutable and must never be overwritten.

## Create the package Git tag and GitHub Release

Create tags only after npm confirms the corresponding publication. For
`ui-components@1.1.0`:

```bash
PACKAGE="@gouvfr-lasuite/ui-components"
VERSION="1.1.0"
TAG="${PACKAGE}@${VERSION}"

git tag -a "$TAG" -m "$TAG"
git push origin "$TAG"
```

Copy the package's `CHANGELOG.md` section for this version into a temporary
release-notes file, then create the GitHub Release:

```bash
gh release create "$TAG" \
  --verify-tag \
  --title "$PACKAGE $VERSION" \
  --notes-file /tmp/ui-components-1.1.0.md \
  --latest=false
```

Do not use `--generate-notes`: repository-wide generated notes can contain
changes belonging to other packages. GitHub has only one repository-wide
"Latest" release, so every package release explicitly uses `--latest=false`.
The npm `latest` dist-tag remains the stable-version authority for each package.

Several package tags and GitHub Releases may point to the same Git commit. A
single-package publication creates only one tag and one GitHub Release.

## First 1.0.0 publications

The three new package manifests already contain version `1.0.0`, so the first
publication does not run `changeset version`. After this pull request is merged,
validate the exact merged commit and publish sequentially:

1. `@gouvfr-lasuite/ui-tokens@1.0.0`;
2. `@gouvfr-lasuite/ui-components@1.0.0`;
3. `@gouvfr-lasuite/ui-codemod@1.0.0`.

Create three package-specific tags and GitHub Releases on that same commit only
after all corresponding npm publications have been verified.

## Failure recovery

- If a dry-run fails, do not publish; correct the release pull request.
- If npm rejects a package before accepting the version, correct the issue and
  retry that same version.
- If npm accepted the version, never reuse or overwrite it. Release a patch for
  any correction.
- If npm publication succeeds but tag or GitHub Release creation fails, keep the
  npm version and finish the missing Git/GitHub metadata on the same commit.
- Deprecate the former packages and archive Cunningham only after the new
  packages have been installed and validated in a real consumer.
