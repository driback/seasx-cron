FROM node:lts-alpine

# Install pnpm
RUN npm install -g pnpm

# Create src directory
WORKDIR /src

# Copy package.json and pnpm-lock.yaml (if you have one)
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Bundle app source
COPY . .

# Build the app (if needed)
RUN pnpm run build

ARG PORT
EXPOSE ${PORT:-3000}

CMD ["pnpm", "start"]