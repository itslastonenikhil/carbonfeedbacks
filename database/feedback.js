const { db, TABLE_NAMES } = require('./connect');

function createFeedback(feedback) {
    return db(TABLE_NAMES.Feedback).insert(feedback);
}

function getFeedbackByFeedbackId(feedback_id) {
    return db(TABLE_NAMES.Feedback).where("feedback_id", feedback_id);
}

function getFeedbackByServiceId(service_id) {
    return db(TABLE_NAMES.Feedback).where("service_id", service_id);
}

function getAllFeedbacks() {
    return db(TABLE_NAMES.Feedback).select("*");
}

function deleteFeedback(feedback_id) {
    return db(TABLE_NAMES.Feedback).where("feedback_id", feedback_id).del();
}

function updateFeedback(feedback) {
    const { feedback_id, ...rest} = feedback;
    return db(TABLE_NAMES.Feedback).where("feedback_id", feedback_id).update(rest);
}

function getAllFeedbacksByAdminId(admin_id){
    return db(TABLE_NAMES.Feedback).join(TABLE_NAMES.Service, `${TABLE_NAMES.Feedback}.service_id`, `${TABLE_NAMES.Service}.service_id`).where('admin_id', admin_id)
}

function getAllFeedbacksByUserId(user_id){
    return db(TABLE_NAMES.Feedback).join(TABLE_NAMES.Service, `${TABLE_NAMES.Feedback}.service_id`, `${TABLE_NAMES.Service}.service_id`).where('user_id', user_id)
}

module.exports = {
    createFeedback,
    getFeedbackByFeedbackId,
    getFeedbackByServiceId,
    getAllFeedbacksByAdminId,
    getAllFeedbacksByUserId,
    getAllFeedbacks,
    deleteFeedback,
    updateFeedback
};