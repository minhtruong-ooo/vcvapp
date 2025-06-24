# Sử dụng Bun official image
FROM oven/bun:1.1.6

# Đặt thư mục làm việc
WORKDIR /app

# Copy toàn bộ source code
COPY . .

# Cài dependencies + devDependencies
RUN bun install --development

# Build project (dùng vite hoặc tương tự)
RUN bun run build

# Mở port 3000 nếu server chạy ở đó
EXPOSE 3000

# Lệnh chạy server (tuỳ theo bạn cấu hình)
CMD ["bun", "bun-server.ts"]
