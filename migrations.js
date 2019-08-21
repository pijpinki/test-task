const database = require('./modules/Database');
const books = require('./migrations/books');
const users = require('./migrations/users');
const fill = require('./migrations/fill');

database.setLoggerLevel('info');
database.init()
    .then(() => users())
    .then(() => books())
    .then(() => fill())
    .then(() => database.logger.info('DONE'))
    .catch(r => database.logger.error(r))
    .then(() => database.connection.end());
