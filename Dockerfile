FROM node:10-alpine

WORKDIR /usr/src/app

COPY . /usr/src/app/

RUN npm install

EXPOSE 3001

RUN apk --update add tzdata \
    && cp /usr/share/zoneinfo/Asia/Singapore /etc/localtime \
    && echo "Asia/Singapore" > /etc/timezone \
    && apk del tzdata \
    && rm -rf /var/cache/apk/*

CMD npm start
