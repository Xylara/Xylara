FROM node: 18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN pnpm install

COPY . .

EXPOSE 3001
CMD [ "npm", "start" ]