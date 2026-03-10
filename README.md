# inner-circle-invoices-ui

## Getting Started

```
npm ci

npm start
```

## Create local docker container to connect it with local-env

```
npm run docker:build:local-env
```

## Create local docker container to work in it (local docker container for layout-ui service must run too)
```
npm run docker:build

npm run docker:run
```

## Component tests

To run component tests in console you need enter the command

```
npm run cypress:run:component
```

To open cypress to run component tests you need enter the command

```
npm run cypress:open:component
```

## E2E tests

For e2e tests you must to ask your colleagues for the `cypress.config.prod.ts` file if it needs

to open cypress use this command

```
npm run cypress:open:e2e
```

to run it in console

```
npm run cypress:run:e2e
```

to run test in local-env you need `cypress.config.local-env.ts` file and use command

```
npm run cypress:run:e2e:local-env
```
