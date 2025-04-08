# specify the base image with your desired version
FROM guergeiro/pnpm:latest-latest
COPY . .
RUN pnpm install
CMD ["pnpm", "start"]
