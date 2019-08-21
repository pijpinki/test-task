const logger = require('../modules/logger');
const User = require('../models/User');
const Book = require('../models/Book');

class Fill {
    static execute() {
        const f = new this();
        return f.main();
    }

    constructor() {
        this.users = [];
        this.books = [];
        this.MAX_USERS = 1e3;
        this.MAX_BOOKS = 1e5;
        this.logger = logger.getLogger('Fill base data');
        this.logger.level = 'all';
    }

    static generateRandomNumber(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }

    static generateRandomString(length) {
        let string = '';
        for (let i = 0; i < length; i++) {
            const buff = Buffer.alloc(1);
            buff[0] = this.generateRandomNumber(0x41, 0x5A);
            string += buff.toString('utf-8');
        }
        return string;
    }

    fillUsers() {
        for (let i = 0; i < this.MAX_USERS; i++) {
            this.users.push({
                name: this.constructor.generateRandomString(10),
                surname: this.constructor.generateRandomString(10),
                password: this.constructor.generateRandomString(1024),
                email: `${this.constructor.generateRandomString(5)}-${this.users.length}@email.com`,
            });
        }
    }

    fillBooks(users) {
        for (let i = 0; i < this.MAX_BOOKS; i++) {
            const indexNeed = this.constructor.generateRandomNumber(0, users.length - 1);
            this.books.push({
                author_id: users.find((u, index) => index === indexNeed).id,
                title: this.constructor.generateRandomString(5),
                description: this.constructor.generateRandomString(50),
                image: 'https://s46.radikal.ru/i114/0910/c5/7de696e7955b.jpg',
                date: new Date(),
            });
        }
    }

    async main() {
        this.fillUsers();
        await User.addUsers(this.users);
        const users = await User.getUsers();
        this.fillBooks(users);
        await Book.addBooks(this.books);
    }
}

module.exports = () => Fill.execute();
