# ---------- Stage 1: Build ASP.NET app ----------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy toàn bộ project source code
COPY . ./

# Build ứng dụng
RUN dotnet publish -c Release -o out

# ---------- Stage 2: Runtime image ----------
FROM mcr.microsoft.com/dotnet/aspnet:8.0

# Cài LibreOffice và các font cần thiết
RUN apt-get update && \
    apt-get install -y \
    libreoffice libreoffice-calc libreoffice-writer \
    fonts-dejavu fontconfig \
    libxrender1 libfontconfig1 libxext6 && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy font Calibri từ thư mục host (nếu bạn có calibri.ttf, arial.ttf, ...)
COPY ./wwwroot/fonts /usr/share/fonts/truetype/custom

# Cập nhật font cache để LibreOffice nhận font mới
RUN fc-cache -f -v

# Copy ứng dụng đã publish từ stage build
WORKDIR /app
COPY --from=build /app/out .

# Thiết lập cấu hình ASP.NET
ENV ASPNETCORE_URLS=http://+:5100
EXPOSE 5100

ENTRYPOINT ["dotnet", "MediaService.dll"]
