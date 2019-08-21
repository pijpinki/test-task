const BaseHandler = require('../BaseHandler');
const Book = require('../../models/Book');
const Api = require('../../modules/Api');

/**
 * @api {GET} /books
 * @apiName List
 * @apiGroup Books
 * @apiParam {number} [offset = 0]
 * @apiParam {number} [limit = 100]
 * @apiParam {object} [sort = {}]
 * @apiParam {object} [filter = {}]
 *
 * @apiSuccess {number} offset
 * @apiSuccess {number} limit
 * @apiSuccess {object} sort
 * @apiSuccess {object} filter
 * @apiUse Books
 * @apiUse Error
 * @apiExample params
 * {
 *     filter: {id: 1},
 *     sort: {id: 'DESC'},
 * }
 */
class BooksList extends BaseHandler {
    static get method() {
        return 'get';
    }

    static get endpoint() {
        return '/books';
    }

    get params() {
        const offset = parseInt(this.data.offset, 10) || 0;
        const limit = parseInt(this.data.limit, 10) || 100;
        const sort = this.data.sort || {};
        const filter = this.data.filter || {};

        return {
            offset,
            limit,
            sort,
            filter,
        };
    }

    validate() {
        const {
            sort, filter, offset, limit,
        } = this.params;
        if (typeof sort !== 'object') this.throw(400, 'Wrong sort format');
        if (typeof filter !== 'object') this.throw(400, 'Wrong filter format');
        if (offset < 0) this.throw(400, 'Offset must be > 0');
        if (limit < 0) this.throw(400, 'Limit must be > 0');
        if (Array.isArray(sort)) this.throw(400, 'Sort must be object');
        if (Array.isArray(filter)) this.throw(400, 'Filter must be object');
        return true;
    }

    async onRequest() {
        this.validate();
        const books = await Book.getBooksList(this.params);
        this.send({
            limit: this.params.limit,
            offset: this.params.offset,
            sort: this.params.sort,
            filter: this.params.filter,
            books: Api.normalizeBooks(books),
        });
    }
}

module.exports = BooksList;
