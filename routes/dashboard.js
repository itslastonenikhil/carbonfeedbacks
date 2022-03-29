const express = require('express');
const router = express.Router();
const middleware = require("./middleware")
const {
    db,
    User,
    Admin,
    Service,
    Feedback,
    TABLE_NAMES,
} = require("../database");
const utility = require("../utility");
const { nanoid } = require("nanoid");



//===================
// USER ROUTES
//===================

router.get("/user/:username", middleware.isLoggedIn, (req, res) => {
    res.send(req.params.username);
})


//User Feedback Routes
//---------------------

// Show all feedbacks ------

router.get("/user/:username/feedbacks", middleware.isLoggedIn, (req, res) => {
    res.send("Feedbacks page");
})

// Create new feedback ------

// Feedback form
router.get("/user/:username/feedbacks/new", middleware.isLoggedIn, (req, res) => {


})

// Add feedback
router.post("/user/:username/feedbacks", middleware.isLoggedIn, middleware.isAdmin,  async (req, res) => {
    const date = utility.getDate();

    //get user from database
    let user = await User.getUserByUsername(req.params.username);
    user = user[0];
   
    //get feedback desc
    let desc = req.body.description;

    //get feedback sentiment
    let sentiment = await utility.getSentiment(desc);
    
    //create new feedbacks object
    const new_feedback = {
        feedback_id: nanoid(),
        user_id: user.user_id,
        service_id: req.body.service_id,
        description: desc,
        sentiment: sentiment,
        created_at: date
    }

    await Feedback.createFeedback(new_feedback);

    res.redirect(`/dashboard/user/${req.params.username}/feedbacks`);

})

// Update feedback ------

router.put("/user/:username/feedbacks/:feedback_id", middleware.isLoggedIn, async(req, res) => {
    //get feedback desc
    let description = req.body.description;
    
    //get feedback sentiment
    let sentiment = await utility.getSentiment(description);
    
    //get feedback
    const updated_feedback = req.body;
    updated_feedback.sentiment = sentiment;
    updated_feedback.description = description;

    //update feedback
    await Feedback.updateFeedback(updated_feedback);

    //redirect
    res.redirect(`/dashboard/user/${req.params.username}/feedbacks`);

})

// Delete feedback -------

router.delete("/user/:username/feedbacks/:feedback_id", middleware.isLoggedIn, async(req, res) => {
    await Feedback.deleteFeedback(req.params.feedback_id);

    res.redirect(`/dashboard/user/${req.params.username}/feedbacks`)

})




//===================
// ADMIN ROUTES
//===================
router.get("/admin/:username", middleware.isLoggedIn, (req, res) => {
    console.log("admin logged");
    res.send(req.params.username);
})

// Create new service ------

router.get("/admin/:username/services", middleware.isLoggedIn, async (req, res) => {
    res.send("Service Page")
})

// Service form
router.get("/admin/:username/services/new", middleware.isLoggedIn, (req, res) => {
    res.send("Add new service")
})

// Add service
router.post("/admin/:username/services", middleware.isLoggedIn, async (req, res) => {

    const date = utility.getDate();

    let admin = await Admin.getAdminByUsername(req.params.username);
    admin = admin[0];
    console.log(admin)

    const new_service = {
        service_id: nanoid(),
        admin_id: admin.admin_id,
        service_name: req.body.service_name,
        service_desc: req.body.desc,
        created_at: date
    }

    await Service.createService(new_service);

    console.log(new_service);
    res.redirect(`/dashboard/admin/${req.params.username}/services`);

})

// Update service ------

router.put("/admin/:username/services/:service_id", middleware.isLoggedIn, async(req, res) => {
    //get feedback desc
    let service_desc = req.body.service_desc;
    let service_name = req.body.service_name;
    
    //get feedback
    const updated_service = req.body;
    updated_service.service_desc = service_desc;
    updated_service.service_name = service_name;

    //update feedback
    await Service.updateService(updated_service);

    //redirect
    res.redirect(`/dashboard/admin/${req.params.username}/services`);


})

// Delete service ------

router.delete("/admin/:username/services/:service_id", middleware.isLoggedIn,async (req, res) => {
    console.log(req.params);
    await Service.deleteService(req.params.service_id);
    console.log("service deleted");
    res.redirect(`/dashboard/admin/${req.params.username}/services`);
})

//-----------------------
//logout user or admin
//-----------------------
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

module.exports = router;