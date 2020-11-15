FROM node:alpine

ENV CI true
ENV YARN_ENABLE_SCRIPTS false

WORKDIR /usr/src/app

COPY . .

RUN yarn install --immutable

CMD [ "yarn", "start" ]
