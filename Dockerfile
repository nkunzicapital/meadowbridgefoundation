# ── Stage 1: Build ──────────────────────────────────────────────────
FROM node:20-slim AS builder

WORKDIR /app

# Install build tools needed for native modules (e.g. argon2)
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy package files first (better Docker layer caching)
COPY package.json ./
COPY bun.lock* package-lock.json* yarn.lock* ./

# Install ALL dependencies (dev deps needed for the Vite build)
RUN npm install --legacy-peer-deps

# Copy the rest of the source
COPY . .

# Build the app (react-router build → outputs to ./build/)
RUN npm run build

# ── Stage 2: Production runner ───────────────────────────────────────
FROM node:20-slim AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copy only what's needed to run
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Digital Ocean injects $PORT at runtime; the Hono server reads it automatically
EXPOSE 3000

CMD ["node", "./build/server/index.js"]
