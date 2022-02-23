FROM node:latest

WORKDIR /usr/src/CDN/core
COPY . .

RUN npm install
RUN rm package-lock.json

CMD [ "node", "index.js" ]
