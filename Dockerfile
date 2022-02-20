FROM node:16-alpine

WORKDIR /usr/src/CDN
COPY . .

RUN npm install
RUN npm audit fix

WORKDIR /usr/src/CDN/src
CMD [ "node", "index.js" ]
