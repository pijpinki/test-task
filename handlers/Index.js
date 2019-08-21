const Handler = require('./BaseHandler');

class Index extends Handler {
    static get method() {
        return 'get';
    }

    static get endpoint() {
        return '/';
    }

    async onRequest() {
        return this.send('Hello world');
    }
}

module.exports = Index;
