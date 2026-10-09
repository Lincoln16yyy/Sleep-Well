# syntax=docker/dockerfile:1

# ---- Etapa 1: build estatico do front-end ----
FROM node:24-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# URL da API e embutida no build (Vite nao le variaveis em tempo de execucao)
ARG VITE_API_URL=http://localhost:8080/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ---- Etapa 2: serve os arquivos com Nginx (SPA) ----
FROM nginx:1.29-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
