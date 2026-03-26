FROM node:20-alpine

WORKDIR /app

COPY shared ./shared
COPY services/doctor-service ./services/doctor-service

RUN cd services/doctor-service && npm install

EXPOSE 3002

CMD ["node", "services/doctor-service/src/index.js"]

