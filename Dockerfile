FROM node:16-alpine
RUN mkdir /usr/src
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
COPY ./build ./
RUN npm install serve -g
EXPOSE 3000
CMD ["serve", "-s", "."]