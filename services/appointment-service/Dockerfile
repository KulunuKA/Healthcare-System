FROM node:20-alpine

WORKDIR /app

COPY shared ./shared
COPY services/appointment-service ./services/appointment-service

RUN cd services/appointment-service && npm install

EXPOSE 3003

CMD ["node", "services/appointment-service/src/index.js"]

