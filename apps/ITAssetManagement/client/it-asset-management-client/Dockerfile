# Base image
FROM oven/bun:1.0.25

# Set working directory
WORKDIR /app

# Copy necessary files
COPY bun.lockb package.json tsconfig.json vite.config.ts ./
COPY . .

# Install dependencies
RUN bun install

# Build React app
RUN bun run build

# Start Bun server
CMD ["bun", "bun-server.ts"]

# Expose port
EXPOSE 3000
