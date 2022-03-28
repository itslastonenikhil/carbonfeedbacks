const { db, TABLE_NAMES } = require('./connect');

function createService(service) {
    return db(TABLE_NAMES.Service).insert(service);
}

function getService({ service_id }) {
    return db(TABLE_NAMES.Service).where("service_id", service_id);
}

function getAllServices() {
    return db(TABLE_NAMES.Service).select("*");
}

function deleteService({ service_id }) {
    return db(TABLE_NAMES.Service).where("service_id", service_id).del();
}

function updateService(service) {
    const { service_id } = service;
    return db(TABLE_NAMES.Service).where("service_id", service_id).update(admin);
}

module.exports = {
    createService,
    getService,
    getAllServices,
    deleteService,
    updateService
};