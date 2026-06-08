FROM node:20-alpine AS base
WORKDIR /app

# ✅ Copy package.json FIRST
COPY package*.json ./
RUN npm install --legacy-peer-deps

FROM base AS development
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]

FROM base AS production
COPY . .
RUN npm run build
EXPOSE 80
CMD ["npx", "serve", "-s", "dist", "-l", "80"]