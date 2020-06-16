This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Install Dependencies

You need to run these commands before start the development.

### `npm install`
### `npm install -g firebase-tools netlify-cli netlify-lambda`

## Available Scripts

In the project directory, you can run:

### `npm run start:client`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run start:functions`

Runs the AWS Lambda functions on localhost. <br />
Open [http://localhost:9000/.netlify/functions/index](http://localhost:9000/.netlify/functions/index) to execute the `index` function. 

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run test:coverage`

Run the coverage test

### `npm run build`

Builds both client and functions.

### `npm run build:client`

Builds the app for production to the `build` folder.

### `npm run build:functions`

Builds the functions for production to the `lambda` folder.

### `npm run deploy`

Builds the app for production to the `build` and `lambda` folder and deploy to firebase and netlify.

### `npm run deploy:firebase`

Builds the app for production to the `build` folder and deploy to firebase hosting.

### `npm run deploy:netlify`

Builds the app for production to the `build` and `lambda` folder and deploy to netlify.

### `npm run lint`
### `npm run lint:fix`

Run ESLint and fix