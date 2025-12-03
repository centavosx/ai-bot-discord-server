# syntax=docker.io/docker/dockerfile:1

FROM --platform=linux/amd64 node:22.12.0-bullseye AS base

WORKDIR /app

# Enable Corepack and prepare Yarn 4
RUN corepack enable && corepack prepare yarn@4.5.3 --activate

# Install native build tools required for @swc/core, argon2, etc.
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY .yarn ./.yarn
COPY .yarnrc.yml package.json yarn.lock* .npmrc* ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM base AS runner
WORKDIR /app

COPY --from=base /app/dist ./dist
COPY --from=base /app/.env .
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/scripts ./scripts
COPY --from=base /app/package.json .
COPY --from=base /app/.yarn /.yarn
COPY --from=base /app/.yarnrc.yml .

CMD ["node", "dist/main"]
