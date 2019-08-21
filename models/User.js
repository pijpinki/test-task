const database = require('../modules/Database');

class User {
    static get table() {
        return 'users';
    }

    /**
     * Add users to database
     * @param {User~user[]} users
     */
    static addUsers(users) {
        const sql = `INSERT INTO ${this.table} (name, surname, email, password) VALUES ?`;
        const data = users.map(user => [user.name, user.surname, user.email, user.password]);
        return database.query(sql, [data]);
    }

    static getUsers() {
        return database.query(`SELECT * FROM ${this.table}`);
    }

    static getUsersById(id) {
        return database.query(`SELECT * FROM ${this.table} WHERE id=${Number(id)}`);
    }
}

module.exports = User;

/**
 * @typedef {object} User~user
 * @property {number} [id]      - record id
 * @property {string} name      - user name
 * @property {string} surname   - user second name
 * @property {string} email     - user email
 * @property {string} password  - user hashed password
 * @property {Date}  [created]  - created date
 * @property {Date}  [deleted]  - deleted date
 */
