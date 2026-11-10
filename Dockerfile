FROM node:22-alpine
WORKDIR /app
COPY package.json server.js ./
COPY public ./public
COPY mp3 ./mp3
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server.js"]
