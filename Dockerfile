# specify the base image with your desired version
FROM guergeiro/pnpm:22-9-alpine
COPY . .
RUN pnpm install
CMD ["pnpm", "start"]
