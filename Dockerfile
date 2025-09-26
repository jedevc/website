ARG BASE_URL

FROM ubuntu:24.04 AS base
RUN apt-get update && apt-get install -y curl git

FROM node:20-bullseye AS node
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM base AS sass
ARG SASS_VERSION=1.93.1
RUN curl -L -o /tmp/dart-sass.tar.gz https://github.com/sass/dart-sass/releases/download/1.93.1/dart-sass-1.93.1-linux-x64.tar.gz && \
    mkdir -p /mnt/dart-sass && \
    tar --extract --directory /mnt/dart-sass --file /tmp/dart-sass.tar.gz --strip 2
COPY <<"EOF" /usr/bin/sass
#!/bin/sh
exec "/usr/share/dart-sass/dart" "/usr/share/dart-sass/sass.snapshot" "$@"
EOF
RUN chmod +x /usr/bin/sass && \
    mkdir -p /usr/share/dart-sass && \
cp /mnt/dart-sass/dart /usr/share/dart-sass/dart && \
cp /mnt/dart-sass/sass.snapshot /usr/share/dart-sass/sass.snapshot

FROM base AS builder
ARG HUGO_VERSION=0.118.2
RUN curl -L -o /tmp/hugo.deb https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb \
    && dpkg -i /tmp/hugo.deb
COPY --from=sass /usr/bin/sass /usr/bin/sass
COPY --from=sass /usr/share/dart-sass /usr/share/dart-sass

FROM builder AS hugo
WORKDIR /app
COPY . .
COPY --from=node /app/node_modules ./node_modules
ENV HUGO_ENVIRONMENT=production
ENV HUGO_ENV=production
ARG BASE_URL
RUN hugo --gc --minify --baseURL="$BASE_URL"
RUN ls -lha .

FROM scratch
COPY --from=hugo /app/public .
