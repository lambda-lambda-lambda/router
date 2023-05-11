# L³ router

[![npm version](https://badge.fury.io/js/@lambda-lambda-lambda%2Frouter.svg)](https://badge.fury.io/js/@lambda-lambda-lambda%2Frouter) [![](https://img.shields.io/npm/dm/@lambda-lambda-lambda/router.svg)](https://www.npmjs.com/package/@lambda-lambda-lambda/router) [![Build Status](https://api.travis-ci.com/lambda-lambda-lambda/router.svg?branch=master)](https://app.travis-ci.com/github/lambda-lambda-lambda/router) [![Coverage](https://coveralls.io/repos/lambda-lambda-lambda/router/badge.svg?branch=master)](https://coveralls.io/r/lambda-lambda-lambda/router?branch=master) [![Install size](https://packagephobia.com/badge?p=@lambda-lambda-lambda/router)](https://packagephobia.com/result?p=@lambda-lambda-lambda/router)

AWS [CloudFront Lambda@Edge](https://docs.aws.amazon.com/lambda/latest/dg/lambda-edge.html) serverless application router.

![lambda-lambda-lambda](https://raw.githubusercontent.com/lambda-lambda-lambda/router/master/package.png)

## Features

- Request/Response handling [API](https://github.com/lambda-lambda-lambda/manual/blob/master/CommonMethods.md).
- [Routes](ComplexRouting.md#route-handler) and URI [Resource](https://github.com/lambda-lambda-lambda/manual/blob/master/ComplexRouting.md#resource-handler) support.
- Local/Globally scoped [Middleware](https://github.com/lambda-lambda-lambda/manual/blob/master/Middleware.md#scope).
- [Visual Studio Code](https://code.visualstudio.com) integration.
- Open Source, [MIT licensed](https://github.com/lambda-lambda-lambda/router/blob/master/LICENSE), FREE.
- Lightweight (**no dependencies**).

## Getting started

The easiest way to created an application, without the need to [manually install](#manual-installation) this package, is to use the [L³ Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=Nuxy.vscode-lambda-lambda-lambda). Doing so allows you to..

- Scaffold app sources and dependencies.
- Run it locally (in [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers))
- Test code changes in realtime.
- Deploy app sources to AWS.
- Generate [JSDoc](https://jsdoc.app)/[Swagger](https://swagger.io) documentation.

## Build dependencies

If you're not using the [L³ VS Code extension](https://marketplace.visualstudio.com/items?itemName=Nuxy.vscode-lambda-lambda-lambda) and want to _run this package locally_ you must install the following dependencies:

- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
- [Node.js](https://nodejs.org)

## Manual installation

If you just looking to leverage the Request/Response handling [API](CommonMethods.md) in your Lambda functions, install this package using [NPM](https://npmjs.com).

    $ npm install @lambda-lambda-lambda/router

## Documentation

- [AWS requirements](https://github.com/lambda-lambda-lambda/manual/blob/master/AWSRequirements.md)
- [Usage](https://github.com/lambda-lambda-lambda/manual/blob/master/Usage.md)
- [Common methods](https://github.com/lambda-lambda-lambda/manual/blob/master/CommonMethods.md)
- [Complex routing](https://github.com/lambda-lambda-lambda/manual/blob/master/ComplexRouting.md)
- [Middleware](https://github.com/lambda-lambda-lambda/manual/blob/master/Middleware.md)
- [Developers](https://github.com/lambda-lambda-lambda/manual/blob/master/Developers.md)
- [Testing](https://github.com/lambda-lambda-lambda/manual/blob/master/Testing.md)

## Versioning

This package is maintained under the [Semantic Versioning](https://semver.org) guidelines.

## License and Warranty

This package is distributed in the hope that it will be useful, but without any warranty; without even the implied warranty of merchantability or fitness for a particular purpose.

_lambda-lambda-lambda/router_ is provided under the terms of the [MIT license](http://www.opensource.org/licenses/mit-license.php)

[AWS](https://aws.amazon.com) is a registered trademark of Amazon Web Services, Inc.

## Author

[Marc S. Brooks](https://github.com/nuxy)
