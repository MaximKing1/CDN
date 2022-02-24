FROM node:latest

WORKDIR /usr/src/CDN/slave
COPY . .

RUN npm install

EXPOSE 3005
CMD [ "node", "index.js" ]
