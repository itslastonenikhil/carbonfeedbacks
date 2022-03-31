const express = require('express');
const router = express.Router();
const middleware = require('./middleware');
const { User, Admin, Service, Feedback } = require('../database');
const utility = require('../utility');
const { nanoid } = require('nanoid');
const { isLoggedIn } = require('./middleware');

//===================
// USER ROUTES
//===================

router.get('/user/:username', middleware.isLoggedIn, (req, res) => {
	res.redirect(`/dashboard/user/${req.params.username}/feedbacks`);
});

router.get('/user/:username/profile', middleware.isLoggedIn, (req, res)=>{
	res.render("profile.ejs");
})

//User Feedback Routes
//---------------------

// Show all feedbacks ------

router.get('/user/:username/feedbacks', middleware.isLoggedIn, async(req, res) => {
	const user = (await User.getUserByUsername(req.params.username))[0];
	const feedbacks = await Feedback.getAllFeedbacksByUserId(user.user_id);

	res.render("feedback.ejs", { feedbacks });
});

// Create new feedback ------

// Feedback form
router.get('/user/:username/feedbacks/new',middleware.isLoggedIn, async(req, res) => {
	let services = await Service.getAllServices();
	
	res.render("new_feedback.ejs", {services});
});

// Add feedback
router.post(
	'/user/:username/feedbacks',
	middleware.isLoggedIn,
	async (req, res) => {
	
		const date = utility.getDate();

		//get user from database
		const user = (await User.getUserByUsername(req.params.username))[0];

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
			created_at: date,
		};

		await Feedback.createFeedback(new_feedback);

		res.redirect(`/dashboard/user/${req.params.username}/feedbacks`);
	}
);

// Update feedback ------

router.get('/user/:username/feedbacks/:feedback_id', middleware.isLoggedIn, async(req, res)=>{
	let feedback = (await Feedback.getFeedbackByFeedbackId(req.params.feedback_id))[0];
	let services = await Service.getAllServices();
	res.render("update_feedback.ejs", {feedback, services});
})

router.put(
	'/user/:username/feedbacks/:feedback_id',
	middleware.isLoggedIn,
	async (req, res) => {
		//get feedback desc
		
		let description = req.body.description;

		//get feedback sentiment
		let sentiment = await utility.getSentiment(description);

		//get feedback
		const updated_feedback = req.body;
		updated_feedback.sentiment = sentiment;
		updated_feedback.feedback_id = req.params.feedback_id;

		//update feedback
		await Feedback.updateFeedback(updated_feedback);

		//redirect
		res.redirect(`/dashboard/user/${req.params.username}/feedbacks`);
	},
);

// Delete feedback -------

router.delete(
	'/user/:username/feedbacks/:feedback_id',
	middleware.isLoggedIn,
	async (req, res) => {
		await Feedback.deleteFeedback(req.params.feedback_id);

		res.redirect(`/dashboard/user/${req.params.username}/feedbacks`);
	},
);

//===================
// ADMIN ROUTES
//===================

router.get('/admin/:username', middleware.isLoggedIn, async(req, res)=>{
	res.redirect(`/dashboard/admin/${req.params.username}/feedbacks`);
})

router.get('/admin/:username/profile', middleware.isLoggedIn, (req, res)=>{
	res.render("profile.ejs");
})

router.get('/admin/:username/report', middleware.isLoggedIn, async (req, res) => {
	const { username } = req.params;
	
	const admin = (await Admin.getAdminByUsername(username))[0];
	
	const services = await Service.getServiceByAdminId(admin.admin_id);

	const service_sentiments = [];
	let feedback_count = 0;
	const pie_chart = {
		positive: 0,
		negative: 0,
		neutral: 0,
	};

	for (let i = 0; i < services.length; i++) {
		const service = services[i];
		const { service_id, service_name } = service;
		const feedbacks = await Feedback.getFeedbackByServiceId(service_id);

		feedback_count += feedbacks.length;

		const sentiment_obj = {
			service_id,
			service_name
		};
		
		let positive, negative, neutral;
		positive = negative = neutral = 0;

		for (let feedback in feedbacks) {
			const { sentiment: curr_sentiment } = feedback;

			if (curr_sentiment >= -0.2 && curr_sentiment <= 0.2)
				neutral++;
			else if (curr_sentiment <= -0.2) negative++;
			else positive++;
		}

		sentiment_obj.total = positive + negative + neutral;
		sentiment_obj.positive_per = sentiment_obj.neutral_per = sentiment_obj.negative_per = 0;

		if(sentiment_obj.total) {
			sentiment_obj.positive_per = (positive/sentiment_obj.total)*100;
			sentiment_obj.neutral_per = (neutral/sentiment_obj.total)*100;
			sentiment_obj.negative_per = (negative/sentiment_obj.total)*100;
		}

		pie_chart.positive += positive;
		pie_chart.negative += negative;
		pie_chart.neutral += neutral;

		service_sentiments.push(sentiment_obj);
	}

	res.render('report.ejs', {
		type: 'admin',
		sentiments: service_sentiments,
		count: feedback_count,
		pie_chart
	});
});


router.get('/admin/:username/feedbacks', middleware.isLoggedIn, async(req, res)=>{
	const admin = (await Admin.getAdminByUsername(req.params.username))[0];
	const feedbacks = await Feedback.getAllFeedbacksByAdminId(admin.admin_id);

	for(let i = 0; i < feedbacks.length; i++) {
		const feedback = feedbacks[i];
		feedback.name = (await User.getUserById(feedback.user_id))[0].username;
	}

	res.render("feedback.ejs", { feedbacks });
	
})



// Create new service ------

router.get('/admin/:username/services',middleware.isLoggedIn,async (req, res) => {
	const admin = (await Admin.getAdminByUsername(req.params.username))[0];
	const services = await Service.getServiceByAdminId(admin.admin_id);
	res.render("service.ejs", {services});
});

// Service form
router.get('/admin/:username/services/new',middleware.isLoggedIn,(req, res) => {
	res.render("new_service.ejs");
});

// Add service
router.post(
	'/admin/:username/services',
	middleware.isLoggedIn,
	async (req, res) => {
		const date = utility.getDate();

		let admin = await Admin.getAdminByUsername(req.params.username);
		admin = admin[0];
	

		const new_service = {
			service_id: nanoid(),
			admin_id: admin.admin_id,
			service_name: req.body.service_name,
			service_desc: req.body.desc,
			created_at: date,
		};

		await Service.createService(new_service);

	
		res.redirect(`/dashboard/admin/${req.params.username}/services`);
	},
);

// Update service ------
router.get('/admin/:username/services/:service_id', middleware.isLoggedIn, async(req, res)=>{
	
	let service = (await Service.getServiceByServiceId(req.params.service_id))[0];
	res.render("update_service.ejs", {service});
})

router.put(
	'/admin/:username/services/:service_id',
	middleware.isLoggedIn,
	async (req, res) => {
		//get feedback desc
	

		//get feedback
		const updated_service = req.body;
		updated_service.service_id = req.params.service_id;

		//update feedback
		await Service.updateService(updated_service);

		//redirect
		res.redirect(`/dashboard/admin/${req.params.username}/services`);
	},
);

// Delete service ------

router.delete(
	'/admin/:username/services/:service_id',
	middleware.isLoggedIn,
	async (req, res) => {
	
		await Service.deleteService(req.params.service_id);
	
		res.redirect(`/dashboard/admin/${req.params.username}/services`);
	},
);

//-----------------------
//logout user or admin
//-----------------------
router.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

module.exports = router;
