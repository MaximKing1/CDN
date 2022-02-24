FROM node:latest

WORKDIR /usr/src/CDN/slave
COPY . .

RUN npm install && npm update
RUN npm rebuild bcrypt

CMD [ "node", "index.js" ]
