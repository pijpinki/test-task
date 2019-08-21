const BaseHandler = require('../BaseHandler');
const User = require('../../models/User');
const Book = require('../../models/Book');
const Api = require('../../modules/Api');

/**
 * @api {POST} /books
 * @apiName AddBooks
 * @apiGroup Books
 * @apiParam {string} title         - book title max 64 chars
 * @apiParam {string} description   - book description
 * @apiParam {string} image         - book image url
 * @apiParam {number} author_id     - book author id
 *
 * @apiSuccess {boolean} success
 * @apiUse Book
 * @apiUse Error
 */
class BooksAdd extends BaseHandler {
    static get method() {
        return 'post';
    }

    static get endpoint() {
        return '/books';
    }

    async validate() {
        const {
            title, description, image, author_id,
        } = this.data;
        if (!title) this.throw(400, 'Missed title');
        if (!description) this.throw(400, 'Missed description');
        if (!image) this.throw(400, 'Missed image');
        if (!author_id) this.throw(400, 'Missed author');

        if (title.length > 64) this.throw(400, 'Title to big');
        const [user] = await User.getUsersById(author_id);
        if (!user) this.throw(404, 'Author not found');
        return true;
    }

    async onRequest() {
        await this.validate();
        const { insertId } = await Book.addBook(this.data);
        const [book] = await Book.getBooksList({ filter: { id: insertId } });
        this.send({
            book: Api.normalizeBook(book),
            success: true,
        });
    }
}

module.exports = BooksAdd;
