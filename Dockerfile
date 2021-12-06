FROM node:16-alpine
RUN mkdir /usr/src
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm i
CMD ["npm", "run", "start:react"]