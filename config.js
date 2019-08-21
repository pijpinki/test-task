const config = {
    mysql: {
        user: 'root',
        password: '123qqq',
        host: 'localhost',
        database: 'testtask',
        debug: true,
    },
    api: {
        port: 8199,
    },
    logger: {
        path: __dirname,
        fileName: 'app.log',
    },
};

module.exports = config;
