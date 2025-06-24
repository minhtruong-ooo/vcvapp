# Stage 1: Build app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy font Calibri vào image
COPY ./wwwroot/fonts /usr/share/fonts/truetype/custom

# Cập nhật font cache
RUN fc-cache -f -v

COPY . ./
RUN dotnet publish -c Release -o out

# Stage 2: Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0

# Cài LibreOffice và font cơ bản (không dùng mscorefonts)
RUN apt-get update && \
    apt-get install -y libreoffice libreoffice-calc libreoffice-writer \
    fonts-dejavu \
    libxrender1 libfontconfig1 libxext6 && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy ứng dụng đã build
WORKDIR /app
COPY --from=build /app/out .

# Cấu hình ASP.NET
ENV ASPNETCORE_URLS=http://+:5100
EXPOSE 5100

ENTRYPOINT ["dotnet", "MediaService.dll"]
