#!/bin/sh
VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')

docker build --tag aura-retro-bot:${VERSION} .
# Update image tag to latest
docker tag aura-retro-bot:${VERSION} aura-retro-bot:latest
