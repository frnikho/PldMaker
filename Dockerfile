FROM node:16.17.0-bullseye as base

RUN npm i -g nx serve pnpm
COPY package.json /app/
WORKDIR "/app/"
RUN pnpm i

COPY . /app/

FROM base as api
WORKDIR "/app/"
CMD pnpm run build:api

FROM base as web
WORKDIR "/app/"
RUN pnpm nx build web
CMD ["serve", "dist/apps/web", "-p", "4200", "-s"]
