'use strict';

const event          = require(`${PACKAGE_ROOT}/test/event.json`);
const chai           = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon          = require('sinon');

chai.use(chaiAsPromised);

const expect = chai.expect;

// Load modules.
const {RouterError} = require(`${PACKAGE_ROOT}/src/router/Error.js`);
const Request       = require(`${PACKAGE_ROOT}/src/router/Request.js`);
const Response      = require(`${PACKAGE_ROOT}/src/router/Response.js`);
const Stack         = require(`${PACKAGE_ROOT}/src/router/Stack.js`);
const Utils         = require(`${PACKAGE_ROOT}/src/router/Utils.js`);

describe('Stack module', function() {
  describe('Instance methods', function() {
    describe('add', function() {
      describe('middleware', function() {
        it('should return value', function() {
          const stack = new Stack();

          const func = function(req, res, next) {};
          const name = 'middleware';

          Utils.setFuncName(func, name);

          stack.add(func);

          const result = stack.middleware;

          expect(result[0]).to.be.an('function');
          expect(result[0].name).to.equal(name);
        });

        it('should not return value', function() {
          const stack = new Stack();

          stack.add({func: 'invalid'});

          const result = stack.middleware;

          expect(result[0]).to.be.undefined;
        });
      });

      describe('routes', function() {
        const stack = new Stack();

        const func = function(req, res, next) {};
        const name = 'route:index';

        Utils.setFuncName(func, name);

        stack.add(func);

        const result = stack.routes;

        it('should return value', function() {
          expect(result[0]).to.be.an('function');
          expect(result[0].name).to.equal(name);
        });
      });

      describe('resources', function() {
        const stack = new Stack();

        const func = function(req, res, next) {};
        const name = 'resource:index';

        Utils.setFuncName(func, name);

        stack.add(func);

        const result = stack.resources;

        it('should return value', function() {
          expect(result[0]).to.be.an('function');
          expect(result[0].name).to.equal(name);
        });
      });

      describe('fallback', function() {
        const stack = new Stack();

        const func = function(req, res, next) {};
        const name = 'fallback';

        Utils.setFuncName(func, name);

        stack.add(func);

        const result = stack.fallback;

        it('should return value', function() {
          expect(result).to.be.an('function');
          expect(result.name).to.equal(name);
        });
      });
    });

    describe('exec', function() {
      describe('sync', function() {
        const stack = new Stack();

        let count = 0;

        const func1 = function(req, res, next) {
          res.setHeader('Middleware', true);
          count++;
          next();
        };

        Utils.setFuncName(func1, 'middleware');

        const func2 = function(req, res, next) {
          res.setHeader('Route', true);
          res.status(200).send('Success');
          count++;
          next();
        };

        Utils.setFuncName(func1, 'route:get');

        const func3 = function(req, res, next) {
          res.setHeader('Resource', true);
          res.status(200).send('Success');
          count++;
          next();
        };

        Utils.setFuncName(func1, 'resource:get');

        const func4 = function(req, res, next) {
          res.setHeader('Fallback', true);
          res.status(200).send('Success');
          count++;
          next();
        };

        Utils.setFuncName(func1, 'fallback');

        stack.middleware = [func1];
        stack.routes     = [func2];
        stack.resources  = [func3];
        stack.fallback   = func4;

        const req = new Request(event.Records[0].cf.request, {});
        const res = new Response({});

        stack.exec(req, res);

        const result = res.data();

        it('should execute functions', function() {
          expect(count).to.equal(4);
        });

        it('should return headers', function() {
          expect(result.headers.middleware).to.be.an('array');
          expect(result.headers.route).to.be.an('array');
          expect(result.headers.resource).to.be.an('array');
          expect(result.headers.fallback).to.be.an('array');
        });

        it('should return status', function() {
          expect(result.status).to.equal(200);
        });

        it('should return body', function() {
          expect(result.body).to.equal('Success');
        });
      });

      describe('async', function() {
        describe('complete', function() {
          const stack = new Stack();

          let count = 0;

          const func1 = async function(req, res, next) {
            res.setHeader('Middleware', true);
            await count++;
          };

          Utils.setFuncName(func1, 'middleware');

          const func2 = async function(req, res, next) {
            res.setHeader('Route', true);
            res.status(200).send('Success');
            await count++;
          };

          Utils.setFuncName(func1, 'route:get');

          const func3 = async function(req, res, next) {
            res.setHeader('Resource', true);
            res.status(200).send('Success');
            await count++;
          };

          Utils.setFuncName(func1, 'resource:get');

          const func4 = async function(req, res, next) {
            res.setHeader('Fallback', true);
            res.status(200).send('Success');
            await count++;
          };

          Utils.setFuncName(func1, 'fallback');

          stack.middleware = [func1];
          stack.routes     = [func2];
          stack.resources  = [func3];
          stack.fallback   = func4;

          const req = new Request(event.Records[0].cf.request, {});
          const res = new Response({});

          const promise = stack.exec(req, res);

          const result = res.data();

          it('should execute functions', function() {
            expect(count).to.equal(4);
          });

          it('should return headers', function() {
            expect(result.headers.middleware).to.be.an('array');
            expect(result.headers.route).to.be.an('array');
            expect(result.headers.resource).to.be.an('array');
            expect(result.headers.fallback).to.be.an('array');
          });

          it('should return status', function() {
            expect(result.status).to.equal(200);
          });

          it('should return body', function() {
            expect(result.body).to.equal('Success');
          });

          it('should resolve Promise', function() {
            return expect(promise).to.be.fulfilled;
          });
        });

        describe('next()', function() {
          const stack = new Stack();

          const func1 = async function(req, res, next) {
            res.setHeader('Middleware', true);
          };

          Utils.setFuncName(func1, 'middleware');

          const func2 = async function(req, res, next) {
            res.setHeader('Middleware', true);
            next();
          };

          Utils.setFuncName(func2, 'middleware');

          stack.middleware = [func1, func2];

          const req = new Request(event.Records[0].cf.request, {});
          const res = new Response({});

          it('should throw Error', function() {
            const promise = stack.exec(req, res);

            return expect(promise).to.be.rejectedWith(RouterError, /Middleware next\(\) is unsupported/);
          });
        });

        describe('Promise.reject()', function() {
          describe('with message', function() {
            const stack = new Stack();

            const func1 = async function(req, res, next) {
              res.setHeader('Middleware', true);
            };

            Utils.setFuncName(func1, 'middleware');

            const func2 = async function(req, res, next) {
              res.setHeader('Middleware', true);

              return Promise.reject('Output to console');
            };

            Utils.setFuncName(func2, 'middleware');

            stack.middleware = [func1, func2];

            const req = new Request(event.Records[0].cf.request, {});
            const res = new Response({});

            before(function() {
              sinon.stub(console, 'info');
            });

            it('should resolve Promise', function() {
              const promise = stack.exec(req, res);

              return expect(promise).to.be.fulfilled;
            });

            it('should output to console', function() {
              expect(console.info.calledWith('Output to console')).to.be.true;
            });
          });

          describe('with RouterError', function() {
            const stack = new Stack();

            const func1 = async function(req, res, next) {
              res.setHeader('Middleware', true);
            };

            Utils.setFuncName(func1, 'middleware');

            const func2 = async function(req, res, next) {
              res.setHeader('Middleware', true);

              return Promise.reject(new RouterError('Output to error'));
            };

            Utils.setFuncName(func2, 'middleware');

            stack.middleware = [func1, func2];

            const req = new Request(event.Records[0].cf.request, {});
            const res = new Response({});

            it('should throw Error', function() {
              const promise = stack.exec(req, res);

              return expect(promise).to.be.rejectedWith(RouterError, /Output to error/);
            });
          });

          describe('undefined', function() {
            const stack = new Stack();

            const func1 = async function(req, res, next) {
              res.setHeader('Middleware', true);
            };

            Utils.setFuncName(func1, 'middleware');

            const func2 = async function(req, res, next) {
              res.setHeader('Middleware', true);

              return Promise.reject();
            };

            Utils.setFuncName(func2, 'middleware');

            stack.middleware = [func1, func2];

            const req = new Request(event.Records[0].cf.request, {});
            const res = new Response({});

            it('should ignore exception', function() {
              const promise = stack.exec(req, res);

              return expect(promise).to.be.fulfilled;
            });
          });
        });
      });
    });

    describe('plugin', function() {
      describe('sync', function() {
        const stack = new Stack();

        const func1 = function(req, res, next) {
          const num = 1;

          req.plugin('foo', num);
          next();
        };

        Utils.setFuncName(func1, 'middleware');

        const func2 = function(req, res, next) {
          const num = req.plugin('foo');

          req.plugin('foo', num + 1);
          next();
        };

        Utils.setFuncName(func2, 'middleware');

        const func3 = function(req, res, next) {
          const num = req.plugin('foo');

          req.plugin('foo', num + 1);
          next();
        };

        Utils.setFuncName(func3, 'route:get');

        const func4 = function(req, res, next) {
          const num = req.plugin('foo');

          req.plugin('foo', num + 1);
          next();
        };

        Utils.setFuncName(func4, 'resource:get');

        const func5 = function(req, res, next) {
          const num = req.plugin('foo');

          res.status(200).send(num);
          next();
        };

        stack.middleware = [func1, func2];
        stack.routes     = [func3];
        stack.resources  = [func4];
        stack.fallback   = func5;

        const req = new Request(event.Records[0].cf.request, {});
        const res = new Response({});

        stack.exec(req, res);

        const result = res.data();

        it('should not return headers', function() {
          expect(result.headers).to.be.empty;
        });

        it('should return status', function() {
          expect(result.status).to.equal(200);
        });

        it('should return body', function() {
          expect(result.body).to.equal('4');
        });
      });

      describe('async', function() {
        const stack = new Stack();

        const func1 = async function(req, res, next) {
          const num = 1;

          req.plugin('foo', num);
        };

        Utils.setFuncName(func1, 'middleware');

        const func2 = async function(req, res, next) {
          const num = req.plugin('foo');

          req.plugin('foo', num + 1);
        };

        Utils.setFuncName(func2, 'middleware');

        const func3 = async function(req, res, next) {
          const num = req.plugin('foo');

          req.plugin('foo', num + 1);
        };

        Utils.setFuncName(func3, 'route:get');

        const func4 = async function(req, res, next) {
          const num = req.plugin('foo');

          req.plugin('foo', num + 1);
        };

        Utils.setFuncName(func4, 'resource:get');

        const func5 = async function(req, res, next) {
          const num = req.plugin('foo');

          res.status(200).send(num);
        };

        stack.middleware = [func1, func2];
        stack.routes     = [func3];
        stack.resources  = [func4];
        stack.fallback   = func5;

        const req = new Request(event.Records[0].cf.request, {});
        const res = new Response({});

        stack.exec(req, res);

        const result = res.data();

        it('should not return headers', function() {
          expect(result.headers).to.be.empty;
        });

        it('should return status', function() {
          expect(result.status).to.equal(200);
        });

        it('should return body', function() {
          expect(result.body).to.equal('4');
        });
      });
    });
  });
});
