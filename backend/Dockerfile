FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

ENV DATABASE_URL="postgresql://postgres:dummy@localhost:5432/dummy?schema=public"
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./prisma.config.ts

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/generated ./generated

EXPOSE 3001

# TS meng-compile src/ + generated/ sehingga entrypoint ada di dist/src/main.js
CMD ["node", "dist/src/main"]
