FROM alpine:edge

RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  freetype-dev \
  harfbuzz \
  ca-certificates \
  ttf-freefont \
  nodejs \
  yarn

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY . /app/
WORKDIR app

RUN yarn

RUN addgroup -S pptruser \
    && adduser -S -g pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && mkdir -p /app/pdfs \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app
