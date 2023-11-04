'use strict';

const chai = require('chai');

const expect = chai.expect;

// Load modules.
const {RouterError} = require(`${PACKAGE_ROOT}/src/router/Error.js`);

describe('Error module', function() {
  describe('RouterError', function() {
    it('should throw error', function() {
      const message = 'An error occurred';

      const result = function() {
        throw new RouterError(message);
      };

      expect(result).to.throw(RouterError, message);
    });
  });
});
