const database = require('../modules/Database');
const User = require('./User');

class Book {
    static get table() {
        return 'books';
    }

    static get sortFilterParams() {
        return ['id', 'title', 'description', 'image', 'date', 'created', 'author'];
    }

    /**
     * Add books to database
     * @param {Book~book[]} books
     */
    static addBooks(books) {
        const sql = `INSERT INTO ${this.table} (author_id, title, description, image, date) VALUES ?`;
        const data = books.map(book => [
            book.author_id,
            book.title,
            book.description,
            book.image,
            book.date || new Date(),
        ]);
        return database.query(sql, [data]);
    }

    static getValueForWhere(value) {
        return typeof value === 'number' ? `${value}` : `"${value}"`;
    }

    /**
     * Get book lists
     * @param {object} params
     * @param {object} [params.offset = 0]  - skip offset
     * @param {object} [params.limit = 100] - limit rows
     * @param {object} [params.sort = {}]   - sort object
     * @param {object} [params.filter = {}] - filter object
     */
    static getBooksList(params = {}) {
        const offset = params.offset || 0;
        const limit = params.limit || 100;
        const sort = params.sort || {};
        const filter = params.filter || {};
        let where = `${this.table}.deleted IS NULL`;
        let order = '';

        for (const key in filter) {
            if (!filter.hasOwnProperty(key)) continue;
            if (!this.sortFilterParams.find(k => k === key)) continue;
            if (key === 'author') {
                where += ` ${where.length ? 'AND' : ''} ${User.table}.name = ${this.getValueForWhere(filter[key])}`;
            } else {
                where += ` ${where.length ? 'AND' : ''} ${this.table}.${key} = ${this.getValueForWhere(filter[key])}`;
            }
        }

        for (const key in sort) {
            if (!sort.hasOwnProperty(key)) continue;
            if (!this.sortFilterParams.find(k => k === key)) continue;
            if (key === 'author') {
                order += `${order.length ? ',' : ''} ${User.table}.name ${sort[key].toUpperCase()}}`;
            } else {
                order += `${order.length ? ',' : ''} ${this.table}.${key} ${sort[key].toUpperCase()}`;
            }
        }

        let sql = `SELECT ${this.table}.*, ${User.table}.name as author FROM ${this.table} `;
        sql += ` JOIN ${User.table} on ${User.table}.id = ${this.table}.author_id`;
        if (where.length) sql += ` WHERE ${where}`;
        if (order.length) sql += ` ORDER BY ${order}`;
        sql += ` LIMIT ${limit}`;
        sql += ` OFFSET ${offset}`;
        return database.query(sql);
    }

    /**
     * Add book
     * @param {Book~book} params
     * @return {Promise<*>}
     */
    static addBook(params) {
        return this.addBooks([params]);
    }

    /**
     * Edit book
     * @param {object} params
     * @param {number} params.id
     * @param {number} [author_id]
     * @param {string} [params.title]
     * @param {string} [params.description]
     * @param {string} [params.image]
     */
    static editBook(params) {
        const FIELDS = ['author_id', 'title', 'description', 'image'];
        let set = '';
        for (const key in params) {
            if (!params.hasOwnProperty(key)) continue;
            if (!FIELDS.find(f => f === key)) continue;
            set += `${set.length ? ',' : ''} ${key}=${this.getValueForWhere(params[key])}`;
        }
        if (!set.length) return true;
        const sql = `UPDATE ${this.table} SET ${set}, updated=current_timestamp WHERE id=${Number(params.id)}`;
        return database.query(sql);
    }
}

module.exports = Book;

/**
 * @typedef {object} Book~book
 * @property {number} [id]          - row id
 * @property {number} author_id     - user link
 * @property {string} title         - book title
 * @property {string} description   - book description
 * @property {string} image         - book image
 * @property {Date} date            - created date
 * @property {Date} [created]       - created date
 * @property {Date} [deleted]       - deleted date
 */
