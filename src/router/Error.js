/**
 *  lambda-lambda-lambda/router
 *  AWS Lambda@Edge serverless application router.
 *
 *  Copyright 2021-2025, Marc S. Brooks (https://mbrooks.info)
 *  Licensed under the MIT license:
 *  http://www.opensource.org/licenses/mit-license.php
 */

'use strict';

// Differentiate app/router errors.
class RouterError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

module.exports = {RouterError, RouterError};
