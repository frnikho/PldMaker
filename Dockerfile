FROM node:16.17.0-bullseye as base

RUN npm i -g nx serve
COPY package.json /app/
WORKDIR "/app/"
RUN npm i --legacy-peer-deps

COPY . /app/

FROM base as api
WORKDIR "/app/"
RUN nx build api
CMD npm run build:api

FROM base as web
WORKDIR "/app/"
RUN nx build web
CMD ["serve", "dist/apps/web", "-p", "4200", "-s"]
