const { db, TABLE_NAMES } = require('./connect');

function createUser(user) {
    return db(TABLE_NAMES.User).insert(user);
}

function getUserById(user_id) {
    return db(TABLE_NAMES.User).where("user_id", user_id);
}

function getUserByUsername(username) {
    return db(TABLE_NAMES.User).where("username", username);
}

function getAllUsers() {
    return db(TABLE_NAMES.User).select("*");
}

function deleteUser(user_id) {
    return db(TABLE_NAMES.User).where("user_id", user_id).del();
}

function updateUser(user) {
    const { user_id } = user;
    return db(TABLE_NAMES.User).where("user_id", user_id).update(user);
}

module.exports = {
    createUser,
    getUserById,
    getUserByUsername,
    getAllUsers,
    deleteUser,
    updateUser
};