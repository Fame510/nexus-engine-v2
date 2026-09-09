FROM node:20-bookworm-slim
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates dumb-init fonts-liberation libnss3 libatk-bridge2.0-0 libdrm2 libxkbcommon0 libgbm1 libasound2 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgtk-3-0 xvfb && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm install --omit=dev && npx playwright install chromium
COPY src ./src
COPY scripts ./scripts
COPY README.md ./README.md
RUN mkdir -p /data/artifacts && chown -R node:node /app /data
USER node
EXPOSE 3000
ENTRYPOINT ["dumb-init","--"]
CMD ["node","src/server.js"]
