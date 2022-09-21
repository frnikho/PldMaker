FROM node:16.17.0-bullseye as base

COPY apps /app/apps
COPY initdb.d /app/initdb.d
COPY libs /app/libs
COPY tools /app/tools
COPY *.json /app/
COPY *.yml /app/
COPY *.js /app/
COPY *.ts /app/
COPY .env /app/

WORKDIR "/app/"

RUN npm i -g nx serve
RUN npm i --legacy-peer-deps

FROM base as api
WORKDIR "/app/"
RUN nx build api
CMD npm run build:api

FROM base as web
WORKDIR "/app/"
RUN nx build web
CMD ["serve", "dist/apps/web", "-p", "4200", "-s"]
