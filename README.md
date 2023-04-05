# lambda-lambda-lambda

[![npm version](https://badge.fury.io/js/lambda-lambda-lambda.svg)](https://badge.fury.io/js/lambda-lambda-lambda) [![](https://img.shields.io/npm/dm/lambda-lambda-lambda.svg)](https://www.npmjs.com/package/lambda-lambda-lambda) [![Build Status](https://api.travis-ci.com/lambda-lambda-lambda/router.svg?branch=master)](https://app.travis-ci.com/github/lambda-lambda-lambda/router) [![Coverage](https://coveralls.io/repos/lambda-lambda-lambda/router/badge.svg?branch=master)](https://coveralls.io/r/lambda-lambda-lambda/router?branch=master)

AWS [CloudFront Lambda@Edge](https://docs.aws.amazon.com/lambda/latest/dg/lambda-edge.html) serverless application router.

![lambda-lambda-lambda](https://raw.githubusercontent.com/nuxy/lambda-lambda-lambda/master/package.png)

## Features

- [Routes](#route-handler) and URI [Resource](#resource-handler) support.
- Local/Globally scoped [Middleware](#middleware).
- Request/Response handling [API](#common-methods).
- Lightweight (**no dependencies**).
- [Pay-per-use](https://aws.amazon.com/lambda/pricing) priced solution.

## Dependencies

- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
- [Node.js](https://nodejs.org)

## Getting started

The easiest way to build a new application, without the need to [manually install](#manual-installation) this package, is to use the [Lambda Lambda Lambda VS Code extension](https://marketplace.visualstudio.com/items?itemName=Nuxy.vscode-lambda-lambda-lambda) which allows you to:

- Scaffold app sources and dependencies.
- Run it locally (in [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers))
- Test code changes in realtime.
- Deploy app sources to AWS.
- Generate [JSDoc](https://jsdoc.app)/[Swagger](https://swagger.io) documentation.

### Manual installation

Install package dependencies using [NPM](https://npmjs.com).

    $ npm install lambda-lambda-lambda

## Usage

Unless your application requires [complex routing](#complex-routing), route handlers can be defined within the [Lambda function scope](https://docs.aws.amazon.com/lambda/latest/operatorguide/global-scope.html).  Otherwise [route handlers](#route-handler) are loaded from `appName/src/routes` directory in hierarchical order, starting with the default handler `appName/src/app.js` as described below.

### Synchronous example

```javascript
// .. appName/src/app.js

'use strict';

// Load module.
const Router = require('lambda-lambda-lambda');

/**
 * @see AWS::Serverless::Function
 */
exports.handler = (event, context, callback) => {
  const {request, response} = event.Records[0].cf;

  const router = new Router(request, response);
  router.setPrefix('/api'); // optional, default /

  // Globally scoped to /api/*
  router.use(function(req, res, next) {
    if (req.method() === 'CONNECT') {
      res.status(405).send();
    } else {
      next(); // Run subsequent handler
    }
  });

  // Send root response.
  router.get('/', function(req, res) {
    res.status(501).send();
  });

  // .. everything else.
  router.default(function(req, res) {
    res.status(404).send();
  });

  callback(null, router.response());
};
```

### Asynchronous example

```javascript
// .. appName/src/app.js

'use strict';

// Load module.
const Router = require('lambda-lambda-lambda');

/**
 * @see AWS::Serverless::Function
 */
exports.handler = async (event) => {
  const {request, response} = event.Records[0].cf;

  const router = new Router(request, response);

    // .. Router Methods

  return await router.response();
};
```

## Common methods

The following methods are supported based on the class context.  For further information please refer to the [JSDoc](#cli-options) generated [documentation](https://nuxy.github.io/lambda-lambda-lambda) which includes method `arguments`/`return` types and general usage examples.

| Router Method               | Description                               |
|-----------------------------|-------------------------------------------|
| `router.setPrefix(path)`    | Set URI path prefix.                      |
| `router.use(func)`          | Load the Route (e.g. [Middleware](#middleware)) handler. |
| `router.get(path, func)`    | Handle HTTP GET requests.                 |
| `router.put(path, func)`    | Handle HTTP PUT requests.                 |
| `router.patch(path, func)`  | Handle HTTP PATCH requests.               |
| `router.post(path, func)`   | Handle HTTP POST requests.                |
| `router.delete(path, func)` | Handle HTTP DELETE requests.              |
| `router.default(func)`      | Set router fallback (default route).      |
| `router.response()`         | Return the AWS response object.           |

| Request Method            | Description                                       |
|---------------------------|---------------------------------------------------|
| `req.is(mimeType)`        | Check `Accept` matches the given value.           |
| `req.header(name)`        | Return value for given HTTP header name.          |
| `req.getHeaders()`        | Return the headers of the request.                |
| `req.method()`            | Return the HTTP method of the request.            |
| `req.uri()`               | Return the relative path of the requested object. |
| `req.clientIp()`          | Return the HTTP client IP (remote address).       |
| `req.param(name)`         | Return the HTTP request parameters or name/value. |
| `req.queryString()`       | Return the serialized query parameters.           |
| `req.body()`              | Return the base64-encoded body data.              |
| `req.plugin(name, value)` | Set/Get value passed down the application stack.  |

| Response Method                 | Description                     |
|---------------------------------|---------------------------------|
| `res.setHeader(name, value)`    | Set HTTP response header.       |
| `res.status(code).send(body)`   | Send the HTTP response (`Array`, `Buffer`, `Object`, `String`). |
| `res.status(code).data(buffer)` | Send binary data with HTTP response. |
| `res.status(code).json(obj)`    | Send the HTTP response as JSON. |
| `res.status(code).text(str)`    | Send the HTTP response as text. |

## Complex routing

When constructing a routing handler the following methods/aliases are supported which can be used interchangeably when defining [Route](#route-handler) or [Resource](#resource-handler) handlers.

| Handler Method | Alias  |
|----------------|--------|
| get            | index  |
| post           | submit |
| put            | create |
| patch          | update |
| delete         | N/A    |

### Route handler

```javascript
// .. appName/src/routes/foo.js

'use strict';

// Load module.
const contentTypeHeader = require('middleware/ContentTypeHeader');

/**
 * @export {Object}
 */
module.exports = {
  middleware: [contentTypeHeader], // Locally scoped to /api/foo

  /**
   * GET /api/foo
   */
  index (req, res) {
    res.status(200).send('Lambda, Lambda, Lambda');
  },

  /**
   * PUT /api/foo
   */
  create (req, res) {
    res.status(201).send();
  },

  /**
   * PATCH /api/foo
   */
  update (req, res) {
    res.status(204).send();
  },

  /**
   * DELETE /api/foo
   */
  delete (req, res) {
    res.status(410).send();
  },

  /**
   * POST /api/foo
   */
  submit (req, res) {
    res.status(200).send();
  }
};
```

### Resource handler

```javascript
// .. appName/src/routes/foo/bar.js

'use strict';

/**
 * @export {Object}
 */
module.exports = {
  resource: true, // Everything is a resource.

  /**
   * GET /api/foo/bar/<resourceId>
   */
  get (req, res, id) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({and: 'Omega Mu'});
  },

  /**
   * PUT /api/foo/bar/<resourceId>
   */
  put (req, res, id) {
    res.status(201).send();
  },

  ..
};
```

### Mixed Route/Resource handler

```javascript
// .. appName/src/routes/foo.js

'use strict';

/**
 * @export {Object}
 */
module.exports = {
  resource: ['put'], // Limit to resource.

  /**
   * GET /api/foo
   */
  index (req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send('Lambda, Lambda, Lambda');
  },

  /**
   * PUT /api/foo/<resourceId>
   */
  put (req, res, id) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({and: 'Omega Mu'});
  },

  ..
};
```

### Asynchronous handler

When using an explicit `Promise` that returns a promised event, always declare your handler method as `async` function (see examples below).

```javascript
// .. appName/src/routes/foo.js

'use strict';

/**
 * @export {Object}
 */
module.exports = {
  resource: ['get', 'patch'],

  /**
   * GET /api/foo
   */
  async index (req, res) {
    return new Promise(function(resolve) {
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send('Lambda, Lambda, Lambda');
      resolve();
    });
  },

  /**
   * GET /api/foo/<resourceId>
   */
  async get (req, res, id) {
    return asyncOperation(id)
      .then(function(result) {
        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(result || 'No result');
      })
      .catch(function() {
        res.status(500).send();
      });
  },

  /**
   * PATCH /api/foo/<resourceId>
   */
  async patch (req, res, id) {
    try {
      const result = await asyncOperation(id);

      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(result || 'No result');
    } catch(err) {
      res.status(500).send();
    }
  },

  ..
};
```

## Middleware

### Synchronous example

```javascript
// .. appName/src/middleware/ContentTypeHeader.js

'use strict';

/**
 * Middleware to send Content-Type header.
 */
module.exports = (req, res, next) => {
  res.setHeader('Content-Type', 'text/html');

  next(); // Run subsequent handler.
};
```

### Asynchronous example

```javascript
// .. appName/src/middleware/SessionCheck.js

'use strict';

/**
 * Middleware to define session state, if exists.
 */
module.exports = async (req, res, next) => {
  if (await checkSession()) {
    req.plugin('session', true); // Passed down the chain.
  } else {
    return Promise.reject()
  }

  // next() should be omitted, use Promise.reject().
};
```

See [restfulApiHandler](https://github.com/lambda-lambda-lambda/example/tree/master/restfulApiHandler/src/middleware) example for more complex use cases.

## Testing

How you handle this is entirely up to the test framework/runner you're using. For examples using [Mocha](https://mochajs.org/) and [Chai](https://www.chaijs.com), please refer to the [E2E tests](https://github.com/nuxy/lambda-lambda-lambda/tree/master/test/e2e/async) included with this package.

## AWS requirements

In order to successfully deploy your application you must have [set-up your AWS Config](https://docs.aws.amazon.com/config/latest/developerguide/gs-cli.html) and have [created an IAM user](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html) with the following [policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_manage.html):

- [IAMFullAccess](https://console.aws.amazon.com/iam/home#/policies/arn%3Aaws%3Aiam%3A%3Aaws%3Apolicy%2FIAMFullAccess)
- [CloudFrontFullAccess](https://console.aws.amazon.com/iam/home#/policies/arn%3Aaws%3Aiam%3A%3Aaws%3Apolicy%2FCloudFrontFullAccess)
- [AWSCloudFormationFullAccess](https://console.aws.amazon.com/iam/home#/policies/arn%3Aaws%3Aiam%3A%3Aaws%3Apolicy%2FAWSCloudFormationFullAccess)
- [AWSLambda_FullAccess](https://console.aws.amazon.com/iam/home#/policies/arn%3Aaws%3Aiam%3A%3Aaws%3Apolicy%2FAWSLambda_FullAccess)

WARNING: The policies above are provided to ensure a successful application deployment.  It is recommended that you adjust these policies to meet the security requirements of your Lambda application.  They should NOT be used in a Production environment.

## Developers

### CLI options

Run [ESLint](https://eslint.org/) on project sources:

    $ npm run lint

Generate documentation using [JSDoc](https://jsdoc.app):

    $ npm run gendoc

Run [Mocha](https://mochajs.org) integration tests:

    $ npm run test

## References

- [Restrictions on edge functions](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/edge-functions-restrictions.html)

## Motivation

I was looking for a **light-weight API driven routing system** (limited dependencies, easy to audit) **that didn't require API Gateway** integration ([Lambda/CloudFront](https://aws.amazon.com/lambda/edge) only) but **could be distributed globally and cached** for cheap.  And finally, I wanted an **unopionionated way to consolidate application code** and dependencies to a **single Lambda/CloudFront behavior**.

Well, my search came short _so I wrote this_.

## Contributions

If you fix a bug, or have a code you want to contribute, please send a pull-request with your changes. (Note: Before committing your code please ensure that you are following the [Node.js style guide](https://github.com/felixge/node-style-guide))

## Versioning

This package is maintained under the [Semantic Versioning](https://semver.org) guidelines.

## License and Warranty

This package is distributed in the hope that it will be useful, but without any warranty; without even the implied warranty of merchantability or fitness for a particular purpose.

_lambda-lambda-lambda_ is provided under the terms of the [MIT license](http://www.opensource.org/licenses/mit-license.php)

[AWS](https://aws.amazon.com) is a registered trademark of Amazon Web Services, Inc.

## Author

[Marc S. Brooks](https://github.com/nuxy)
