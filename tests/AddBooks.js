const assert = require('assert');
const Network = require('./lib/Network');
const Validators = require('./lib/Validators');

const Api = new Network('/books');

describe('Add Books api ', () => {
    describe('Success tests', () => {
        it('Add and find in list', async () => {
            const { body } = await Api.success()
                .method('POST')
                .data({
                    title: 'Test title',
                    description: `Test description ${Math.random()}`,
                    image: 'https://magicmag.net/image/cache/data/items8000/8559/s-l1600-900x900.jpg',
                    author_id: 10, // todo remove hardcode
                })
                .execute();
            assert.strictEqual(body.success, true);
            Validators.book(body.book);
            const list = await Api.success()
                .method('GET')
                .data({
                    filter: {
                        title: body.book.title,
                        description: body.book.description,
                        image: body.book.image,
                        author: body.book.author,
                    },
                })
                .execute();
            assert.notStrictEqual(list.length, 0);
        });
    });
    describe('Error tests', () => {
        it('Input no title', async () => {
            const { body } = await Api.error()
                .method('POST')
                .data({})
                .execute();
            Validators.errorBase(body);
            assert.strictEqual(body.error.message, 'Missed title');
        });
        it('Input no description', async () => {
            const { body } = await Api.error()
                .method('POST')
                .data({ title: 'Test' })
                .execute();
            Validators.errorBase(body);
            assert.strictEqual(body.error.message, 'Missed description');
        });
        it('Input no image', async () => {
            const { body } = await Api.error()
                .method('POST')
                .data({
                    title: 'Test',
                    description: 'test',
                })
                .execute();
            Validators.errorBase(body);
            assert.strictEqual(body.error.message, 'Missed image');
        });
        it('Input no author', async () => {
            const { body } = await Api.error()
                .method('POST')
                .data({
                    title: 'Test',
                    description: 'test',
                    image: 'test',
                })
                .execute();
            Validators.errorBase(body);
            assert.strictEqual(body.error.message, 'Missed author');
        });
        it('Input title to big', async () => {
            const { body } = await Api.error()
                .method('POST')
                .data({
                    title: '12345678901234567890123456789012356789012345678990-1241234567890-234567894567',
                    description: '1',
                    image: 1,
                    author_id: -1,
                })
                .execute();
            Validators.errorBase(body);
            assert.strictEqual(body.error.message, 'Title to big');
        });
        it('Author not found', async () => {
            const { body } = await Api.error()
                .method('POST')
                .data({
                    title: 'test',
                    description: 'test',
                    image: 'text',
                    author_id: -1,
                })
                .execute();
            Validators.errorBase(body);
            assert.strictEqual(body.error.message, 'Author not found');
        });
    });
});
