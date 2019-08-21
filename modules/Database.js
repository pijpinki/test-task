const mysql = require('mysql');
const logger = require('./logger');
const config = require('../config');

class Database {
    constructor() {
        this.connection = null;
        this.logger = logger.getLogger('Database');
        this.logger.level = config.mysql.debug ? 'all' : 'info';
    }

    setLoggerLevel(level) {
        this.logger.level = level;
        return this;
    }

    async init() {
        this.connection = mysql.createConnection({
            host: config.mysql.host,
            user: config.mysql.user,
            database: config.mysql.database,
            password: config.mysql.password,
        });
        await new Promise((resolve, reject) => (
            this.connection.connect(err => (err ? reject(err) : resolve()))
        ));
        this.logger.info('Database connected');
    }

    async query(...args) {
        this.logger.debug('Sql', ...args);
        return new Promise((resolve, reject) => (
            this.connection.query(...args, (err, res) => (err ? reject(err) : resolve(res)))
        ));
    }
}

module.exports = new Database();
