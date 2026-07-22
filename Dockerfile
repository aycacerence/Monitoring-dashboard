# 1. Build Stage
FROM node:22-alpine AS build
WORKDIR /app

# Paket bağımlılıklarını kopyala ve yükle
COPY package.json package-lock.json* ./
RUN npm install

# Kaynak kodları kopyala ve build al
COPY . .
RUN npm run build

# 2. Production Stage
FROM nginx:alpine

# Nginx ayar dosyasını kopyala 
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Build aşamasından çıkan dosyaları Nginx'e aktar
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
