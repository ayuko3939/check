FROM node:22-slim AS builder 

RUN npm install -g pnpm

WORKDIR /shared
COPY ./shared .
RUN pnpm i && pnpm build

WORKDIR /app
COPY ./backend/package.json .
RUN pnpm install
COPY ./backend /app

RUN pnpm build

FROM gcr.io/distroless/nodejs22-debian12 AS runner

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3001

CMD ["/app/dist/index.js"]