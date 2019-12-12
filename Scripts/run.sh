docker stop aura-retro-bot && docker rm aura-retro-bot
docker run -p 80:3001 -d --name aura-retro-bot -e GOOGLE_APPLICATION_CREDENTIALS=/usr/src/app/firebase-aura-tele.json aura-retro-bot:latest
