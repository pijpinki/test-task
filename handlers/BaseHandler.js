const logger = require('../modules/logger');

class BaseHandler {
    static get method() {
        throw new Error('Missed method');
    }

    static get endpoint() {
        throw new Error('Missed endpoint');
    }

    constructor(ctx) {
        this._ctx = ctx;
        this.logger = logger.getLogger(`${this.constructor.method.toUpperCase()} ${this.constructor.endpoint}`);
        this.logger.level = 'all';
        // this.params = ctx.request.params;
        this.data = { ...ctx.request.body, ...ctx.request.query };
        this.logger.debug(this.data);
        this._ctx.logger = this.logger;
    }

    async onRequest() {
        throw new Error('Request is missing');
    }

    send(data, status = 200) {
        this._ctx.status = status;
        this._ctx.body = data;
    }

    throw(...params) {
        return this._ctx.throw(...params);
    }
}

module.exports = BaseHandler;
