FROM octoblu/pnpm
MAINTAINER Bob Example <bob@example.com>

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN pnpm install --production --quiet
COPY . /usr/src/app/

CMD [ "pnpm", "start" ] 
