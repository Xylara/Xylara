# specify the base image with your desired version
FROM node:23
COPY . .
RUN npm install -g pnpm
RUN pnpm install
CMD ["npm", "start"]
