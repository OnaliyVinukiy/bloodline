FROM node:lts

WORKDIR /usr/src/backend

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

RUN npm install --save-dev typescript
RUN npx tsc

EXPOSE 5000

CMD ["node", "dist/index.js"]
