# selenium-proxy

## Routes
### `POST /build`
#### Request
```json
{
    "browserstack": boolean,
    "capabilities": object,
    "seleniumURL": string
}
```

#### Response
```json
{
    "id": session ID,
    "capabilities": capabilities
}
```

The `WebDriver` can be reconstructed using:
```js
const selenium = require("selenium-webdriver");
const seleniumHttp = require("selenium-webdriver/http");

const session = new selenium.Session(res.body.id, res.body.capabilities);
const client = Promise.resolve(seleniumURL)
    .then(url => new seleniumHttp.HttpClient(url));
const executor = new seleniumHttp.Executor(client);
driver = new selenium.WebDriver(session, executor);
```

## Environment variables
### `SERVER_HOST`
The host of the server (default: `0.0.0.0`)

### `SERVER_PORT`
The port of the server (default: `4445`)

### `BROWSERSTACK_USER`
The username of the Browserstack accout

### `BROWSERSTACK_ACCESS_KEY`
The acess key of the Browserstack accout

## Note
This project is not intended as a secure proxy. Credentials and information may leak!