const Koa = require('koa');
const router = require('koa-router')();
const qs = require('koa-qs');
const bodyParse = require('koa-body');
const serve = require('koa-static');
const mount = require('koa-mount');
const path = require('path');
const logger = require('./modules/logger')
    .getLogger('app');
const database = require('./modules/Database');
const handlers = require('./handlers');
const config = require('./config');

async function main() {
    await database.init();

    const app = new Koa();
    qs(app, 'extended');
    app.use(bodyParse({
        json: true,
    }));

    for (const Handler of handlers) {
        router[Handler.method.toLowerCase()](Handler.endpoint, ctx => new Handler(ctx).onRequest());
    }
    app.use(async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            ctx.logger.error('===============ERROR================');
            ctx.logger.error(err);
            ctx.logger.error('------------------------------------');
            ctx.logger.error({ ...ctx.request.body, ...ctx.request.query });
            ctx.status = err.statusCode || err.status || 500;
            ctx.body = { error: { message: err.message } };
        }
    });

    app.use(router.routes());
    app.use(mount('/docs', serve(path.join(__dirname, 'apidoc'))));
    app.use((ctx) => {
        ctx.body = 'Sorry path not found';
    });
    await app.listen(config.api.port);
}

main()
    .then(() => logger.info('Server started'))
    .catch((reason) => {
        logger.fatal(reason);
        if (database.connection) database.connection.end();
    });
