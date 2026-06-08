FROM node:20-alpine AS base

# ✅ أضف OpenSSL (Prisma يحتاجه في Alpine Linux)
RUN apk add --no-cache openssl libssl3

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps

FROM base AS production
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 4000
CMD ["npm", "start"]

FROM base AS development
COPY . .
RUN npx prisma generate
EXPOSE 4000
CMD ["npm", "run", "dev"]