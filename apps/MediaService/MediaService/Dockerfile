# ---------- Stage 1: Build ASP.NET app ----------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

COPY . ./
RUN dotnet publish -c Release -o out

# ---------- Stage 2: Runtime image ----------
FROM mcr.microsoft.com/dotnet/aspnet:8.0

# Cài LibreOffice và fontconfig để hỗ trợ Calibri
RUN apt-get update && \
    apt-get install -y \
    libreoffice libreoffice-calc libreoffice-writer \
    fontconfig \
    libxrender1 libfontconfig1 libxext6 && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy font Calibri vào container
COPY ./wwwroot/fonts /usr/share/fonts/truetype/calibri

# Cập nhật font cache
RUN fc-cache -f -v

# Copy ứng dụng đã build
WORKDIR /app
COPY --from=build /app/out .

ENV ASPNETCORE_URLS=http://+:5100
EXPOSE 5100

ENTRYPOINT ["dotnet", "MediaService.dll"]
