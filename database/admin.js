const { db, TABLE_NAMES } = require('./connect');

function createAdmin(admin) {
    return db(TABLE_NAMES.Admin).insert(admin);
}

function getAdminById(admin_id) {
    return db(TABLE_NAMES.Admin).where("admin_id", admin_id);
}

function getAdminByUsername(username) {
    return db(TABLE_NAMES.Admin).where("username", username);
}

function getAllAdmins() {
    return db(TABLE_NAMES.Admin).select("*");
}

function deleteAdmin({ admin_id }) {
    return db(TABLE_NAMES.Admin).where("admin_id", admin_id).del();
}

function updateAdmin(admin) {
    const { admin_id } = admin;
    return db(TABLE_NAMES.Admin).where("admin_id", admin_id).update(admin);
}

module.exports = {
    createAdmin,
    getAdminById,
    getAdminByUsername,
    getAllAdmins,
    deleteAdmin,
    updateAdmin,
    TABLE_NAMES
};