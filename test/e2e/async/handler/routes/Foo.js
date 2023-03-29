'use strict';

/**
 * @export {Object}
 */
module.exports = {

  /**
   * GET /api/<path>
   */
  async index (req, res) {
    return new Promise(function(resolve) {
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send('foo:index');
      resolve();
    });
  },

  /**
   * PUT /api/<path>
   */
  async create (req, res) {
    return new Promise(function(resolve) {
      res.setHeader('Content-Type', 'text/html');
      res.status(201).send('foo:create');
      resolve();
    });
  },

  /**
   * PATCH /api/<path>
   */
  async update (req, res) {
    return new Promise(function(resolve) {
      res.setHeader('Content-Type', 'text/html');
      res.status(204).send('foo:update');
      resolve();
    });
  },

  /**
   * DELETE /api/<path>
   */
  async delete (req, res) {
    return new Promise(function(resolve) {
      res.setHeader('Content-Type', 'text/html');
      res.status(410).send('foo:delete');
      resolve();
    });
  },

  /**
   * POST /api/<path>
   */
  async submit (req, res) {
    return new Promise(function(resolve) {
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send('foo:submit');
      resolve();
    });
  }
};
