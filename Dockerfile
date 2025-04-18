FROM node:23
COPY . .
RUN npm install
CMD ["npm", "start"]
