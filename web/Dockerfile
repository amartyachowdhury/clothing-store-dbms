# Portfolio app container (Next.js + Prisma)
FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm install --ignore-scripts

FROM base AS runner
ENV NODE_ENV=development
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run db:generate

EXPOSE 3000
CMD ["npm", "run", "dev"]

