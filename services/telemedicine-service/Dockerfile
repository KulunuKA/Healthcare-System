FROM node:20-alpine

WORKDIR /app

COPY shared ./shared
COPY services/telemedicine-service ./services/telemedicine-service

RUN cd services/telemedicine-service && npm install

EXPOSE 3004

CMD ["node", "services/telemedicine-service/src/index.js"]

