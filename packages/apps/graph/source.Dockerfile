FROM node:20-bookworm-slim AS build

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN pnpm i -g turbo

WORKDIR /app
COPY ./../../../ .

RUN pnpm install --filter @kadena/graph...
RUN turbo run build --filter @kadena/graph^...
RUN turbo run build --filter @kadena/graph

RUN apt-get update
RUN apt-get install -y openssl
RUN apt-get install -y ssh
RUN apt-get install -y byobu
RUN apt-get install -y postgresql-client

RUN cd packages/apps/graph && pnpm run prisma:generate

EXPOSE 4000
CMD ["node", "./packages/apps/graph/dist/index.js"]
