class Api {
    /**
     * Normalize book
     * @param {object} book
     * @return {Api~book}
     */
    static normalizeBook(book) {
        return {
            id: Number(book.id),
            author_id: String(book.author_id),
            author: String(book.author),
            title: String(book.title),
            description: String(book.description),
            image: String(book.image),
            date: new Date(book.date),
            created: new Date(book.created),
            updated: new Date(book.updated),
        };
    }

    /**
     * Normalize books array
     * @param {object[]} books
     * @return {Api~book[]}
     */
    static normalizeBooks(books) {
        return books.map(book => this.normalizeBook(book));
    }
}

module.exports = Api;

/**
 * @typedef {object} Api~book
 * @property {number}   id          - book id
 * @property {number}   author_id   - book author id
 * @property {string}   author      - book author
 * @property {string}   title       - book title
 * @property {string}   description - book description
 * @property {string}   image       - book image
 * @property {Date}     date        - book created date
 * @property {Date}     created     - book created date
 * @property {Date}     updated     - book updated date
 */
