const assert = require('assert');
const Network = require('./lib/Network');
const Validator = require('./lib/Validators');

const Api = new Network('/books');

const getBooksList = async (filter = {}, limit = 1) => {
    const list = await Api.success()
        .method('GET')
        .data({
            limit,
            filter,
        })
        .execute();
    Validator.successBooks(list.body);
    assert.notStrictEqual(list.body.books.length, 0);
    return list.body.books;
};

describe('Edit books api', () => {
    describe('Success tests', () => {
        it('Edit one book and check list', async () => {
            const description = `Edited test description${Math.random()}`;
            const books = await getBooksList();
            const { body } = await Api.success()
                .method('PUT')
                .data({
                    id: books[0].id,
                    author_id: books[0].author_id,
                    title: 'Edited test title',
                    description,
                    image: 'https://coubsecure-s.akamaihd.net/get/b3/p/coub/simple/cw_timeline_pic/8ef03b26add/2e732d17a2e38ad2d811d/med_1485204846_image.jpg',
                })
                .execute();
            assert.strictEqual(typeof body, 'object');
            Validator.book(body.book);
            const books2 = await getBooksList({ id: body.book.id }, 50);
            assert.strictEqual(!!books2.find(b => b.description === description), true);
        });
    });
    describe('Error tests', () => {
        it('Missed id', async () => {
            const { body } = await Api.error()
                .method('PUT')
                .data({})
                .execute();
            Validator.errorMessage(body, 'Missed id');
        });
        it('Title to big', async () => {
            const books = await getBooksList();
            const { body } = await Api.error()
                .method('PUT')
                .data({
                    id: books[0].id,
                    title: 'hjghuahyu32y4iaiu09po3218ouiljkrny198p3u4nny7148bh1v5784ynjbvpbjmyb6h98174n194b18764189yb716p47',
                })
                .execute();
            Validator.errorMessage(body, 'Title to big');
        });
        it('Wrong author', async () => {
            const books = await getBooksList();
            const [error1, error2, error3] = await Promise.all([
                Api.error()
                    .method('PUT')
                    .data({
                        id: books[0].id,
                        author_id: 'string',
                    })
                    .execute(),
                Api.error()
                    .method('PUT')
                    .data({
                        id: books[0].id,
                        author_id: -1,
                    })
                    .execute(),
                Api.error()
                    .method('PUT')
                    .data({
                        id: books[0].id,
                        author_id: 1e6,
                    })
                    .execute(),
            ]);

            Validator.errorMessage(error1.body, 'Wrong author id');
            Validator.errorMessage(error2.body, 'Wrong author id');
            Validator.errorMessage(error3.body, 'User not found');
        });
    });
});
