FROM node:23
COPY . .
RUN npm install -g bun
RUN bun install
CMD ["bun", "start"]
