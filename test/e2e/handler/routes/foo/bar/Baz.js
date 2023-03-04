'use strict';

/**
 * @export {Object}
 */
module.exports = {

  /**
   * GET /api/<path>
   */
  index (req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send('foo/bar/baz:index');
  },

  /**
   * PUT /api/<path>
   */
  create (req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.status(201).send('foo/bar/baz:create');
  },

  /**
   * PATCH /api/<path>
   */
  update (req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.status(204).send('foo/bar/baz:update');
  },

  /**
   * DELETE /api/<path>
   */
  delete (req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.status(410).send('foo/bar/baz:delete');
  },

  /**
   * POST /api/<path>
   */
  submit (req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send('foo/bar/baz:submit');
  }
};
