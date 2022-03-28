const knex = require('knex');
const process = require('process');
const path = require('path');

const TABLE_NAMES = {
    User: "User",
    Admin: "Admin",
    Service: "Service",
    Feedback: "Feedback",
};

const db = knex({
    client: 'sqlite3',
    connection: {
        filename: path.join(process.cwd(), 'database', 'storage.sqlite3')
    },
    useNullAsDefault: true
});

module.exports = {
    db,
    TABLE_NAMES
};