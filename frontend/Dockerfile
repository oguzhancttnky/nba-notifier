FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

FROM node:18-slim

RUN npm install -g serve

COPY --from=builder /app/build /app

EXPOSE 3000

CMD ["serve", "-s", "/app", "-l", "3000"]
