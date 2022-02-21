FROM node:16-alpine

WORKDIR /usr/src/CDN/core
COPY . .

RUN npm install
RUN npm audit fix

CMD [ "node", "index.js" ]
