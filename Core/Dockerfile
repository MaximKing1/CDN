FROM node:latest

WORKDIR /usr/src/CDN/core
COPY . .

RUN npm install

EXPOSE 3001
EXPOSE 3010
CMD [ "node", "index.js" ]
