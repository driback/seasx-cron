FROM node:20.10.0-slim AS base

# Set up environment variables for pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Expose the application port
ENV PORT=8000

# Copy the package.json and pnpm-lock.yaml for installation
COPY package.json pnpm-lock.yaml ./

# Dependencies for production only
FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Build stage: install all dependencies and build the app
FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

# Final stage: copy over built assets and dependencies
FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

# Expose the port
EXPOSE 8080

# Start the application
CMD ["pnpm", "start"]
