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

FROM base as backend
WORKDIR "/app/"
RUN nx build backend
CMD npm run build:api

FROM base as frontend
WORKDIR "/app/"
RUN nx build front
CMD ["serve", "dist/apps/front", "-p", "4200"]
