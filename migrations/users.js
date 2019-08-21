const database = require('../modules/Database');

const sql = 'create table users ('
    + 'id int primary key auto_increment,'
    + 'name varchar(64) not null,'
    + 'surname varchar(64) not null,'
    + 'email varchar(256) not null,'
    + 'password varchar(1024) not null,'
    + 'created timestamp default current_timestamp null,'
    + 'updated timestamp default null null,'
    + 'deleted timestamp default null null'
    + ')';
const emailIndex = 'create unique index users_email_uindex on users (email);';

module.exports = () => database.query(sql)
    .then(() => database.query(emailIndex));

