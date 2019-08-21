const database = require('../modules/Database');

const sql = `
create table books
(
\tid int auto_increment,
\tauthor_id int not null,
\ttitle varchar(256) not null,
\tdescription text null,
\timage varchar(1024) null,
\tdate timestamp default current_timestamp not null,
\tcreated timestamp default current_timestamp null,
\tupdated timestamp default null null,
\tdeleted timestamp default null null,
\tconstraint books_pk
\t\tprimary key (id),
\tconstraint books_users__fk
\t\tforeign key (author_id) references users (id)
\t\t\ton delete cascade
);
`;

module.exports = () => database.query(sql);
