FROM node:20-alpine

WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 6006

ENV CI=true
CMD ["yarn", "storybook", "--host", "0.0.0.0"]
