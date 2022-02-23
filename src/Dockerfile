FROM node:latest

WORKDIR /usr/src/CDN/slave
COPY . .

RUN rm package-lock.json
RUN npm install

CMD [ "node", "index.js" ]
