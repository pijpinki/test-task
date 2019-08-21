const BaseHandler = require('../BaseHandler');
const Book = require('../../models/Book');
const User = require('../../models/User');
const Api = require('../../modules/Api');


/**
 * @api {PUT} /books
 * @apiName EditBook
 * @apiGroup Books
 * @apiParam {number} id            - book id
 * @apiParam {number} [author_id]   - author id
 * @apiParam {string} [title]       - book title
 * @apiParam {string} [description] - book description
 * @apiParam {string} [image]       - book image
 *
 * @apiSuccess {boolean} success
 * @apiUse Book
 * @apiUse Error
 */
class BooksEdit extends BaseHandler {
    static get method() {
        return 'put';
    }

    static get endpoint() {
        return '/books';
    }

    async validateAuthor() {
        const authorId = parseInt(this.data.author_id, 10);
        if (!authorId) this.throw(400, 'Wrong author id');
        if (authorId <= 0) this.throw(400, 'Wrong author id');
        const [user] = await User.getUsersById(authorId);
        if (!user) this.throw(404, 'User not found');
        return true;
    }

    async validate() {
        const { id, author_id, title } = this.data;
        if (!id) this.throw(400, 'Missed id');
        if (title && title.length > 64) this.throw(400, 'Title to big');
        if (author_id) await this.validateAuthor();
        return true;
    }

    async onRequest() {
        await this.validate();
        await Book.editBook(this.data);
        const [book] = await Book.getBooksList({ filter: { id: this.data.id } });
        this.send({
            book: Api.normalizeBook(book),
            success: true,
        });
    }
}


module.exports = BooksEdit;
