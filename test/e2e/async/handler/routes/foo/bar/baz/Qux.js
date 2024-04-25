'use strict';

// Load modules.
const contentNegotiation = require(`${PACKAGE_ROOT}/test/e2e/async/handler/middleware/ContentNegotiation`);

/**
 * @export {Object}
 */
module.exports = {
  middleware: [contentNegotiation],
  resource: true,

  /**
   * GET /api/<path>/<resourceId>
   */
  async get (req, res, id) {
    res.setHeader('X-Request-ID', id);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({get: true});
  },

  /**
   * PUT /api/<path>/<resourceId>
   */
  async put (req, res, id) {
    res.setHeader('X-Request-ID', id);
    res.setHeader('Content-Type', 'application/json');
    res.status(201).json({put: true});
  },

  /**
   * PATCH /api/<path>/<resourceId>
   */
  async patch (req, res, id) {
    res.setHeader('X-Request-ID', id);
    res.setHeader('Content-Type', 'application/json');
    res.status(204).json({patch: true});
  },

  /**
   * DELETE /api/<path>/<resourceId>
   */
  async delete (req, res, id) {
    res.setHeader('X-Request-ID', id);
    res.setHeader('Content-Type', 'application/json');
    res.status(410).json({delete: true});
  },

  /**
   * POST /api/<path>/<resourceId>
   */
  async post (req, res, id) {
    res.setHeader('X-Request-ID', id);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({post: true});
  }
};
