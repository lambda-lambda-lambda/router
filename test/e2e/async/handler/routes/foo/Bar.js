'use strict';

/**
 * @export {Object}
 */
module.exports = {

  /**
   * GET /api/<path>
   */
  async index (req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send('foo/bar:index');
  },

  /**
   * PUT /api/<path>
   */
  async create (req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.status(201).send('foo/bar:create');
  },

  /**
   * PATCH /api/<path>
   */
  async update (req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.status(204).send('foo/bar:update');;
  },

  /**
   * DELETE /api/<path>
   */
  async delete (req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.status(410).send('foo/bar:delete');
  },

  /**
   * POST /api/<path>
   */
  async submit (req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send('foo/bar:submit');
  }
};
