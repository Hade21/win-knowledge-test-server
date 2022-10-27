FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./
COPY ./src ./src

RUN ls -a
RUN npm install
RUN npm run build

FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY --from=0 /usr/src/app/build ./build

RUN npm install -g pm2

EXPOSE 80

CMD [ "pm2-runtime", "start", "build/main.js" ]