FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --filter @kadena/graph...

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --filter @kadena/graph...
RUN pnpm turbo build --filter @kadena/graph...

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
EXPOSE 4000
CMD [ "pnpm", "start" ]

