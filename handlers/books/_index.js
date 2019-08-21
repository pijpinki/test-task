/**
 * @apiDefine Book
 * @apiSuccess {object} book
 * @apiSuccess {number} book.id          - Book id
 * @apiSuccess {number} book.author_id   - Book author id
 * @apiSuccess {string} book.author      - Book author
 * @apiSuccess {string} book.title       - Book title
 * @apiSuccess {string} book.description - Book description
 * @apiSuccess {string} book.image       - Book image
 * @apiSuccess {string} book.date        - Book date
 * @apiSuccess {string} book.created     - Book created date
 * @apiSuccess {string} book.updated     - Book updated date
 */

/**
 * @apiDefine Books
 * @apiSuccess {object[]} books
 * @apiSuccess {number} books.id          - Book id
 * @apiSuccess {number} books.author_id   - Book author id
 * @apiSuccess {string} books.author      - Book author
 * @apiSuccess {string} books.title       - Book title
 * @apiSuccess {string} books.description - Book description
 * @apiSuccess {string} books.image       - Book image
 * @apiSuccess {string} books.date        - Book date
 * @apiSuccess {string} books.created     - Book created date
 * @apiSuccess {string} books.updated     - Book updated date
 */

/**
 * @apiDefine Error
 * @apiError {object} error
 * @apiError {string} error.message - error message
 */
