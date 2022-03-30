const { db, TABLE_NAMES } = require('./connect');

function createService(service) {
	return db(TABLE_NAMES.Service).insert(service);
}

function getServiceByServiceId(service_id) {
	return db(TABLE_NAMES.Service).where('service_id', service_id);
}

function getServiceByAdminId(admin_id) {
	return db(TABLE_NAMES.Service).where('admin_id', admin_id);
}

function getAllServices() {
	return db(TABLE_NAMES.Service).select('*');
}

function deleteService(service_id) {
	return db(TABLE_NAMES.Service).where('service_id', service_id).del();
}

function updateService(service) {
	const { service_id, ...rest } = service;
	return db(TABLE_NAMES.Service).where('service_id', service_id).update(rest);
}

module.exports = {
	createService,
	getServiceByServiceId,
	getServiceByAdminId,
	getAllServices,
	deleteService,
	updateService,
};
