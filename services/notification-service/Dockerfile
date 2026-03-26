FROM node:20-alpine

WORKDIR /app

COPY shared ./shared
COPY services/notification-service ./services/notification-service

RUN cd services/notification-service && npm install

EXPOSE 3006

CMD ["node", "services/notification-service/src/index.js"]

