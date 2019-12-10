docker stop aura-retro-bot && docker rm aura-retro-bot
docker run -p 80:3001 -d --name aura-retro-bot aura-retro-bot:latest
