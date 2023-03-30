/** @module router/Route */

/**
 *  lambda-lambda-lambda
 *  AWS Lambda@Edge serverless application router.
 *
 *  Copyright 2021-2023, Marc S. Brooks (https://mbrooks.info)
 *  Licensed under the MIT license:
 *  http://www.opensource.org/licenses/mit-license.php
 */

'use strict';

// Local modules.
const {getResourceId, isAsyncFunc, isValidFunc, setFuncName} = require('./Common');

/**
 * Handle routing operations for the given Route.
 *
 * @example
 * // .. sam-app/src/routes/foo.js
 * const routeConfig = {
 *   middleware: [middlewareFunc1, middlewareFunc2],
 *   resource: true || ['get', 'put', 'patch', 'submit'],
 *
 *   index  (req, res) {},
 *   get    (req, res, id) {},
 *   create (req, res) {},
 *   put    (req, res, id) {},
 *   update (req, res) {},
 *   patch  (req, res, id) {},
 *   post   (req, res) {},
 *   submit (req, res, id) {},
 *   delete (req, res, id) {}
 * };
 *
 * module.exports = routeConfig;
 */
module.exports = (router, route) => {
  const path = route.path;

  const methodMap = {
    index: 'get',
    create: 'put',
    update: 'patch',
    delete: 'delete',
    submit: 'post'
  };

  const isResource = !!route.resource;

  const uriBase = `${router.prefix}${path}`;
  const uriPath = getResourceId(router.req.uri(), uriBase);
  const reqPath = `${uriBase}/${uriPath}`;

  // Ensure route matches request URI, skip otherwise.
  if ((!uriPath && !isResource && uriBase !== router.req.uri()) || (uriPath && isResource && reqPath !== router.req.uri())) {
    return;
  }

  // Add route-bound middleware, if available.
  if (route.middleware) {

    /* istanbul ignore else (tested in: test/e2e) */
    if (Array.isArray(route.middleware)) {
      route.middleware.forEach(func => router.use(path, func));
    } else {
      router.use(path, route.middleware);
    }
  }

  // Map Route-defined action -> Request method.
  for (let key in route) {
    const method = methodMap[key] || key;

    if (!isValidFunc(router[method]) || !isValidFunc(route[key])) {
      continue;
    }

    let routeFunc = route[key];
    let entityType = 'route';

    // Support - Boolean | Array<methodMapKey>
    if (isResource && (route.resource === true || (Array.isArray(route.resource) && route.resource.includes(key)))) {
      const resourceId = uriPath;

      // Add resource ID to Route as argument.
      const oldFunc = routeFunc;

      if (isAsyncFunc(oldFunc)) {

        // Asynchronous handling.
        routeFunc = async (req, res) => {
          return await oldFunc(req, res, resourceId);
        };
      } else {

        // Synchronous handling.
        routeFunc = (req, res) => {
          return oldFunc(req, res, resourceId);
        };
      }

      // .. send error response.
      if (!resourceId) {
        routeFunc = (req, res) => {
          res.setHeader('Cache-Control', 'max-age=0');
          res.status(404).send();
        };
      }

      entityType = 'resource';
    }

    setFuncName(routeFunc, `${entityType}:${key}`);

    // Execute the route-defined function.
    router[method](path, routeFunc);
  }
};
