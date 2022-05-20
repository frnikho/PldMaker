FROM node:17-alpine3.14 as base

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

RUN npm i -g nx
RUN npm i

FROM base as backend
WORKDIR "/app/"
RUN nx build backend
CMD ["nx", "serve", "backend", "--host=0.0.0.0"]

FROM base as frontend
WORKDIR "/app/"
RUN nx build front
CMD ["nx", "serve", "front", "--host=0.0.0.0"]