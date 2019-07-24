FROM node:8.16.0-alpine

WORKDIR /app

COPY package.json /app/
RUN npm install

COPY . /app

RUN mkdir baseline-images
RUN mkdir images-to-compare
RUN mkdir report-result

CMD npm run prod baseline-images images-to-compare report-result