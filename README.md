# Basis

## add full icu to node for i18n
```sh
npm install -g full-icu
```

## Setup
```sh
yarn install
```

## run
It's served in http://localhost:3009 .
```sh
yarn start
```

## test
```sh
yarn test
```

## build
It's served in ./static folder.
```sh
yarn run build
```
```sh
yarn run build:staging
```
```sh
yarn run build:dev
```

## client rendering
```sh
yarn run client
```

## server rendering
```sh
yarn run server
```

## change config
config files are located at ./shared/constants/env, you can customize for different environment

staging example:

```json
{
  "ENV": "staging",
  "RIO_CHAIN_API": "wss://node.staging.definex.com",
  "ADMIN_API": "https://admin-api.staging.definex.com",
  "SCAN_API": "https://scan.staging.definex.com"
}
```
