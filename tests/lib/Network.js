const needle = require('needle');
const RequestBuilder = require('./RequestBuilder');
const config = require('../../config');
/**
 * @enum {string} METHODS
 */
const METHODS = ['get', 'post', 'put', 'delete'];

class Network {
    /**
     * @enum {METHODS}
     */
    static get Methods() {
        return METHODS;
    }

    /**
     * @constructor
     * @param {string} path
     */
    constructor(path) {
        this.host = `http://localhost:${config.api.port}${path}`;
    }

    /**
     * Success test handler
     * @param {METHODS} method  - request method
     * @param {object}  [data]  - data to send
     * @return {Promise<object>}
     */
    async successTest(method, data = {}) {
        const response = await needle(method, this.host, data);

        if (response.statusCode !== 200 && response.statusCode !== 201) {
            throw new Error(`Received wrong status ${response.status}`);
        }

        return response;
    }

    /**
     * Error test handler
     * @param {METHODS} method  - request method
     * @param {object}  [data]   - playload
     * @return {Promise<void>}
     */
    async errorTest(method, data = {}) {
        try {
            const response = await needle(method, this.host, data);
            if (response.statusCode === 200 || response.statusCode === 201) {
                throw new Error(`Received wrong status ${response.status}`);
            }
            return response;
        } catch (e) {
            return e;
        }
    }

    /**
     *
     * @returns {NetworkBuilder}
     */
    success() {
        return new RequestBuilder(this.successTest.bind(this));
    }

    /**
     *
     * @returns {NetworkBuilder}
     */
    error() {
        const func = (...args) => this.errorTest(...args);
        return new RequestBuilder(func);
    }
}

/**
 * @type {Network}
 */
module.exports = Network;
