FROM node:18-alpine AS build

WORKDIR /app

EXPOSE 80

COPY ./package*.json .

RUN npm ci

COPY . .

RUN npm run build
RUN node compress.js

FROM fholzer/nginx-brotli:latest

COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
