# Deploy

In order to deploy the storybook to https://ui-kit.lasuite.numerique.gouv.fr/, you need to:

- Ask for an access to the scalingo app
- `git remote add scalingo-prod git@ssh.osc-fr1.scalingo.com:lasuite-ui-kit-prod.git`
- From main: `git push scalingo-prod HEAD:main --force`

And voilà 🥳
