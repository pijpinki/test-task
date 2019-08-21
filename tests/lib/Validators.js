const asserts = require('assert');

const Validators = {
    book(book) {
        asserts.strictEqual(typeof book, 'object');
        asserts.strictEqual(typeof book.title, 'string');
        asserts.strictEqual(typeof book.description, 'string');
        asserts.strictEqual(typeof book.image, 'string');
        asserts.strictEqual(typeof book.author, 'string');
        asserts.strictEqual(typeof new Date(book.date).toLocaleString(), 'string');
    },
    errorBase(data) {
        asserts.strictEqual(typeof data, 'object', 'Response must be object');
        asserts.strictEqual(typeof data.error, 'object', 'Error must be object');
        asserts.strictEqual(typeof data.error.message, 'string', 'Message must be string');
        asserts.strictEqual(data.error.message.length > 0, true, 'Empty message');
    },
    errorMessage(data, message) {
        this.errorBase(data);
        asserts.strictEqual(data.error.message, message);
    },
    successBooks(data) {
        asserts.strictEqual(typeof data, 'object', 'Response must be object');
        asserts.strictEqual(typeof data.books, 'object', 'Books must be array');
        asserts.strictEqual(Array.isArray(data.books), true, 'Books must be array');
        for (const book of data.books) {
            this.book(book);
        }
    },
};

module.exports = Validators;
