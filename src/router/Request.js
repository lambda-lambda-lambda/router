/**
 *  lambda-lambda-lambda/router
 *  AWS Lambda@Edge serverless application router.
 *
 *  Copyright 2021-2025, Marc S. Brooks (https://mbrooks.info)
 *  Licensed under the MIT license:
 *  http://www.opensource.org/licenses/mit-license.php
 */

'use strict';

// Local modules.
const {RouterError} = require('./Error');

/**
 * Provides AWS CloudFront request instance and methods.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-event-structure.html#example-origin-request
 */
class RouterRequest {

  /**
   * @param {CloudFrontRequest} cfReqObj
   *   CloudFront request object.
   */
  constructor(cfReqObj) {
    this.cfReqObj = cfReqObj;
    this.plugins  = {};

    Object.seal(this);
  }

  /**
   * Return CloudFront request object.
   *
   * @return {CloudFrontRequest}
   */
  data() {
    return this.cfReqObj;
  }

  /**
   * Return value for given HTTP header name.
   *
   * @param {String} name
   *   HTTP header name.
   *
   * @return {String|undefined}
   *
   * @example
   * const value = req.header('Content-Type');
   * // text/html
   */
  header(name) {
    const headers = this.getHeaders();

    let value;
    Object.keys(headers).forEach(function(key) {
      if (name && key === name.toLowerCase()) {
        value = headers[key][0].value;
      }
    });
    return value;
  }

  /**
   * Check Accept matches the given value.
   *
   * @param {String} mimeType
   *   MIME type value.
   *
   * @return {Boolean}
   *
   * @example
   * const value = req.is('text/html');
   * // true
   */
  is(mimeType) {
    return (this.header('Accept') === mimeType);
  }

  /**
   * Return the HTTP request parameters or name/value.
   *
   * @param {String} name
   *   Parameter name (optional).
   *
   * @return {String|Object|undefined}
   *
   * @example
   * const params = req.param();
   * // {name: 'value'}
   *
   * const value = req.param('name');
   * // value
   */
  param(name) {
    let obj = {};

    if (this.queryString()) {
      obj = RouterRequest.parseParams(this.queryString());
    } else if (this.body()) {
      obj = RouterRequest.parseBody(this.body());
    }

    if (Object.keys(obj).length > 0) {
      if (name) {
        return obj[name];
      }

      return obj;
    }
  }

  /**
   * Return the HTTP method of the request.
   *
   * @return {String}
   */
  method() {
    return this.data().method;
  }

  /**
   * Return the serialized query parameters.
   *
   * @return {String}
   */
  queryString() {
    return this.data().querystring;
  }

  /**
   * Return the relative path of the requested object.
   *
   * @return {String}
   */
  uri() {
    return this.data().uri;
  }

  /**
   * Return the HTTP client IP (remote address).
   *
   * @return {String}
   */
  clientIp() {
    return this.data().clientIp;
  }

  /**
   * Return the base64-encoded body data.
   *
   * @return {String}
   */
  body() {
    return this.data().body.data;
  }

  /**
   * Return the headers of the request.
   *
   * @return {CloudFrontFunctionsHeaders}
   */
  getHeaders() {
    return this.data().headers;
  }

  /**
   * Set/Get value passed down the application stack.
   *
   * @param {String} name
   *   Plugin name.
   *
   * @param {*} value
   *   Plugin value.
   *
   * @return {*|undefined}
   *
   * @example
   * req.plugin('name', 'value');
   *
   *   ..
   *
   * const value = req.plugin('name');
   * // value
   */
  plugin(name, value) {
    const plugin = this.plugins[name];

    if ((!plugin && name && value) || (plugin && value)) {
      return this.plugins[name] = value;
    } else if (plugin && !value) {
      return this.plugins[name];
    }

    throw new RouterError(`Plugin "${name}" doesn't exist`);
  }

  /**
   * Convert base64-encoded request body to object.
   *
   * @param {String} str
   *   base64 string.
   *
   * @return {Object|undefined}
   */
  static parseBody(str) {
    const body = Buffer.from(
      str, 'base64'
    ).toString();

    if (RouterRequest.isJson(body)) {
      return JSON.parse(body);
    }

    if (RouterRequest.isParams(body)) {
      return RouterRequest.parseParams(body);
    }
  }

  /**
   * Convert serialized query string to object.
   *
   * @param {String} str
   *   Parameter name/value pairs.
   *
   * @return {Object}
   */
  static parseParams(str) {
    return Object.fromEntries(new URLSearchParams(str));
  }

  /**
   * Check valid HTTP request parameters.
   *
   * @param {String} str
   *   Parameter name/value pairs.
   *
   * @return {Boolean}
   */
  static isParams(str) {
    const values = Array.from(new URLSearchParams(str));

    return (values.length > 0 && values[0][0] !== str);
  }

  /**
   * Check valid JSON string format.
   *
   * @param {String} str
   *   JSON string.
   *
   * @return {Boolean}
   */
  static isJson(str) {
    let data;

    try {
      data = JSON.parse(str);
    } catch (err) {
      return false;
    }

    return (Array.isArray(data) || typeof data === 'object');
  }
};

module.exports = RouterRequest;
