FROM node:16-alpine
RUN mkdir /usr/src
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm i
RUN npm install pm2 -g
RUN npm install serve -g
RUN npm run build
CMD ["npm", "run", "prod"]