# Bari-Guide – Express-Server (serviert React-Frontend + API).
# Portabler Build für Northflank / jede Docker-Plattform.
FROM node:22-slim

# pnpm via corepack (Version aus package.json "packageManager")
RUN corepack enable

WORKDIR /app

# Quellcode kopieren (node_modules/dist via .dockerignore ausgeschlossen -> frischer Build)
COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm run build:railway

# api-server liest process.env.PORT
ENV PORT=8080
EXPOSE 8080

CMD ["pnpm", "--filter", "@workspace/api-server", "start"]
