WORKDIR /app

# Copy toàn bộ project
COPY . .

# ✅ Cài đầy đủ dependencies và devDependencies
RUN bun install --development

# ✅ Build project (đảm bảo vite đã được cài)
RUN bun run build

EXPOSE 3000

CMD ["bun", "bun-server.ts"]