# This dockerfile is using @kadena/graph from NPM
FROM node:20 AS build

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm i -g pnpm

WORKDIR /app

RUN apt-get update
RUN apt-get install -y openssl

RUN pnpm i -g @prisma/engines prisma
RUN pnpm i -g @kadena/graph

# empty to satisfy checks
RUN mkdir /app/cwd-extra-migrations

EXPOSE 4000
CMD ["kadena-graph"]
