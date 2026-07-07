# syntax=docker/dockerfile:1

FROM node:22-alpine
WORKDIR /app/API

COPY API/package*.json ./
RUN npm ci --omit=dev

COPY API ./

EXPOSE 8080

CMD ["node", "config/server.js"]
