# Base image
FROM node:20.10.0-slim AS base

# Setup pnpm environment
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Set the working directory
WORKDIR /app

# Set environment variable for the application port
ENV PORT=8000

# Prod-deps stage: install only production dependencies
FROM base AS prod-deps
# Leverage build cache for dependencies installation
COPY pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Build stage: install all dependencies and build the app
FROM base AS build
COPY pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# Final image: Use only the necessary files for production
FROM base
# Copy production dependencies
COPY --from=prod-deps /app/node_modules ./node_modules
# Copy build output
COPY --from=build /app/dist ./dist

# Expose the port
EXPOSE 8080

# Command to start the app
CMD ["pnpm", "start"]
