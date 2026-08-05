FROM node:24-alpine

WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock ./
COPY packages/ui-components/package.json packages/ui-components/package.json
COPY packages/ui-tokens/package.json packages/ui-tokens/package.json
COPY packages/ui-codemod/package.json packages/ui-codemod/package.json
RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 6006

ENV CI=true
CMD ["yarn", "storybook", "--host", "0.0.0.0"]
