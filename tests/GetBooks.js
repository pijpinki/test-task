const assert = require('assert');
const Network = require('./lib/Network');
const Validatros = require('./lib/Validators');

const Api = new Network('/books');

describe('Get Books list api', () => {
    describe('Success tests', () => {
        it('Success list default params', async () => {
            const { body } = await Api.success()
                .method('GET')
                .execute();
            Validatros.successBooks(body);
        });
        it('Success list with limit', async () => {
            const { body } = await Api.success()
                .method('GET')
                .data({ limit: 10 })
                .execute();
            Validatros.successBooks(body);
            assert.strictEqual(body.books.length, 10);
        });
        it('Success list with offset', async () => {
            const [offset, defaultD] = await Promise.all([
                Api.success()
                    .method('GET')
                    .data({ offset: 100 })
                    .execute(),
                Api.success()
                    .method('GET')
                    .execute(),
            ]);
            Validatros.successBooks(offset.body);
            Validatros.successBooks(defaultD.body);
            assert.notDeepStrictEqual(defaultD.body, offset.body);
        });
        it('Success filter title', async () => {
            const list = await Api.success()
                .method('GET')
                .data({
                    limit: 1,
                    offset: 20,
                })
                .execute();
            Validatros.successBooks(list.body);
            if (!list.body.books.length) throw new Error('Empty database');
            const { body } = await Api.success()
                .method('GET')
                .data({ filter: { title: list.body.books[0].title } })
                .execute();
            Validatros.successBooks(body);
            assert.strictEqual(!!body.books.length, true);
            assert.strictEqual(body.books[0].title, list.body.books[0].title);
        });
        it('Success filter title and author', async () => {
            const list = await Api.success()
                .method('GET')
                .data({
                    limit: 1,
                    offset: 20,
                })
                .execute();
            Validatros.successBooks(list.body);
            if (!list.body.books.length) throw new Error('Empty database');
            const { body } = await Api.success()
                .method('GET')
                .data({
                    filter: {
                        author: list.body.books[0].author,
                        title: list.body.books[0].title,
                    },
                })
                .execute();
            Validatros.successBooks(body);
            assert.strictEqual(!!body.books.length, true);
            assert.strictEqual(body.books[0].author, list.body.books[0].author);
            assert.strictEqual(body.books[0].title, list.body.books[0].title);
        });
        it('Success sort title', async () => {
            const [sort, original] = await Promise.all([
                Api.success()
                    .method('GET')
                    .data({ sort: { title: 'desc' } })
                    .execute(),
                Api.success()
                    .method('GET')
                    .execute(),
            ]);
            Validatros.successBooks(sort.body);
            Validatros.successBooks(original.body);
            assert.notDeepStrictEqual(sort.body, original.body);
        });
        it('Success sort id and title', async () => {
            const [sort, original] = await Promise.all([
                Api.success()
                    .method('GET')
                    .data({ sort: { title: 'desc', id: 'asc' } })
                    .execute(),
                Api.success()
                    .method('GET')
                    .execute(),
            ]);
            Validatros.successBooks(sort.body);
            Validatros.successBooks(original.body);
            assert.notDeepStrictEqual(sort.body, original.body);
        });
    });
    describe('Error tests', () => {
        it('Wrong offset', async () => {
            const { body } = await Api.error()
                .method('GET')
                .data({ offset: -1 })
                .execute();
            Validatros.errorBase(body);
            assert.strictEqual(body.error.message, 'Offset must be > 0');
        });
        it('Wrong limit', async () => {
            const { body } = await Api.error()
                .method('GET')
                .data({ limit: -1 })
                .execute();
            Validatros.errorBase(body);
            assert.strictEqual(body.error.message, 'Limit must be > 0');
        });
        it('Wrong sort', async () => {
            const { body } = await Api.error()
                .method('GET')
                .data({
                    sort: [1],
                    limit: 1,
                })
                .execute();
            Validatros.errorBase(body);
            assert.strictEqual(body.error.message, 'Sort must be object');
        });
        it('Wrong filter', async () => {
            const { body } = await Api.error()
                .method('GET')
                .data({ filter: [1] })
                .execute();
            Validatros.errorBase(body);
            assert.strictEqual(body.error.message, 'Filter must be object');
        });
    });
});
