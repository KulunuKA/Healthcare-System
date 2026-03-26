FROM node:20-alpine

WORKDIR /app

COPY shared ./shared
COPY gateway ./gateway

RUN cd gateway && npm install

EXPOSE 3000

CMD ["node", "gateway/src/index.js"]

