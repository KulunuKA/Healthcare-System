FROM node:20-alpine

WORKDIR /app

COPY shared ./shared
COPY services/patient-service ./services/patient-service

RUN cd services/patient-service && npm install

EXPOSE 3001

CMD ["node", "services/patient-service/src/index.js"]

