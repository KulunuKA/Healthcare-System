FROM node:20-alpine

WORKDIR /app

COPY shared ./shared
COPY services/payment-service ./services/payment-service

RUN cd services/payment-service && npm install

EXPOSE 3005

CMD ["node", "services/payment-service/src/index.js"]

