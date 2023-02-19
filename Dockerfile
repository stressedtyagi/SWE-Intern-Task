FROM node:alpine

WORKDIR /koinx-api

COPY package.json .

COPY package-lock.json .

COPY utils /koinx-api/utils

COPY middleware /koinx-api/middleware

COPY .env /koinx-api/.env

RUN npm install

COPY index.js .

EXPOSE 8001

CMD ["node", "index.js"]

