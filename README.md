## Install Dependencies

You need to run these commands before start the development.

### `npm install`
### `npm install -g firebase-tools pm2`

## Available Scripts

In the project directory, you can run:

### `npm run start`

Runs the client

### `npm run start:api`

Runs the api server

### `npm run start:silent`

Runs both client and api server in background

### `npm run stop`

Stop background client and api server

### `npm run prod`

Runs both client and api server in background for production

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run test:coverage`

Run the coverage test

### `npm run build`

Builds the app for production to the `build` folder.

### `npm run docker:build`

Builds docker image

### `npm run docker:push`

Pushes docker image to docker repository 

### `npm run docker:run`

Runs the built docker image

### `npm run deploy`

Runs `docker:build` and `docker:push`

### `npm run lint`
### `npm run lint:fix`

Run ESLint and fix