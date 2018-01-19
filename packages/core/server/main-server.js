import Feedparser from 'feedparser';
import request from 'request';

// Global variables
globalTimeouts = [];
globalIntervals = [];
recipeTimeouts = [];
lastNews = [];
globalNews = [];
demoMode = false;

function clearRecipeDB(timeout) {
	var timeout = timeout || 3000;
	Meteor.call('alert', {
		'message': '*** Removing all Recipes from DB !!!',
		'type': 'danger',
		'style': 'growl-top-right'
	});
	return Meteor.setTimeout(function() {
		Meteor.users.update({}, {
			$set: {
				'recipes': []
			}
		}, {
			multi: true
		});

		Journal.Recipe.db.remove({});
	}, timeout);
}

function getRecipes() {
	globalNews = [];
	var feedParser = new Feedparser();
	var req = request('http://feeds.feedburner.com/elise/simplyrecipes', {
		jar: false,
		timeout: 10000,
		pool: false
	});
	req.setMaxListeners(50);
	// Some feeds do not respond without user-agent and accept headers.
	req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36');
	req.setHeader('accept', 'text/html,application/xhtml+xml');
	req.on('response', function(res) {
		var stream = this;

		if (res.statusCode != 200) {
			return this.emit('error', new Error('Bad status code'));
		}
		stream.pipe(feedParser);
	});
	feedParser
		.on('readable', function() {
			while (item = feedParser.read()) {
				if (item) {
					globalNews.push(item)
				}
			}
		})
}

function loadRecipesToDB(timeInterval, alertFlag) {
	Journal.Recipe.db.remove({});
	Meteor.users.update({}, {
		$set: {
			'recipes': []
		}
	}, {
		multi: true
	});

	Journal.Review.db.remove({});
	if (globalNews.length) {
		return globalNews.map(function(el, index) {
			return Meteor.setTimeout(function() {
				currentUser = Math.random() > 0.5 ? user2 : user1

				Journal.Recipe.create({
					'public': {
						'title': el.title,
						'abstract': el.description,
						'status': 'active'
					},
					'private': {
						'author': currentUser._id
					}
				});
				if (alertFlag) {
					if (el && el.title) {
						Meteor.call('alert', {
							'message': currentUser.profile.firstName + ' ' + currentUser.profile.lastName + ' added new recipe:<br/> <b>"' + el.title + '"<b>',
							'type': 'info',
							'style': 'growl-bottom-right'
						}, currentUser._id);
					}
				}
			}, index * timeInterval)
		});
	} else {
		return [];
	}
}

function runDemoOnce(timeOffset, recipeTimeout, alertFlag) {
	// Clear recent alerts
	Journal.Alert.db.remove({});

	// Clear Database
	// if (alertFlag) {
	Meteor.call('alert', {
		'message': '*** Removing all Recipes !!!',
		'type': 'danger',
		'style': 'growl-top-right'
	});
	// }
	globalTimeouts.push(clearRecipeDB(3000));

	// Get recipes from feed
	getRecipes();

	return Meteor.setTimeout(function() {
		recipeTimeouts = loadRecipesToDB(recipeTimeout, alertFlag);
	}, timeOffset);
}

function runDemoForever(timeInterval) {
	globalTimeouts.push(runDemoOnce(10000, 5000, true));
	return Meteor.setInterval(function() {
		if (globalTimeouts.length) {
			// console.log('Global Timeouts: ', globalTimeouts.length);
			for (var i = 0; i < globalTimeouts.length; i++) {
				Meteor.clearTimeout(globalTimeouts[i]);
			}
			globalTimeouts = [];
		}
		if (recipeTimeouts.length) {
			// console.log('Recipe timeouts: ', recipeTimeouts.length);
			for (var i = 0; i < recipeTimeouts.length; i++) {
				Meteor.clearTimeout(recipeTimeouts[i]);
			}
			recipeTimeouts = [];
		}
		// Run demo once
		globalTimeouts.push(runDemoOnce(10000, 5000, true));
	}, timeInterval);
}

function startDemo() {
	if (globalIntervals.length) {
		// console.log('Global Intervals: ', globalIntervals.length);
		for (var i = 0; i < globalIntervals.length; i++) {
			Meteor.clearInterval(globalIntervals[i]);
		}
		globalIntervals = [];
	}
	globalIntervals.push(runDemoForever(60000));
	// console.log('Endless loop demo started!');
	return true;
}

function stopDemo() {
	if (globalIntervals.length) {
		// console.log('Global Intervals: ', globalIntervals.length);
		for (var i = 0; i < globalIntervals.length; i++) {
			Meteor.clearInterval(globalIntervals[i]);
		}
		globalIntervals = [];
	}
	if (globalTimeouts.length) {
		// console.log('Global Timeouts: ', globalTimeouts.length);
		for (var i = 0; i < globalTimeouts.length; i++) {
			Meteor.clearTimeout(globalTimeouts[i]);
		}
		globalTimeouts = [];
	}
	if (recipeTimeouts.length) {
		// console.log('Recipe timeouts: ', recipeTimeouts.length);
		for (var i = 0; i < recipeTimeouts.length; i++) {
			Meteor.clearTimeout(recipeTimeouts[i]);
		}
		recipeTimeouts = [];
	}

	// getRecipes();
	Meteor.call('alert', {
		'message': '*** Resetting Recipes ...',
		'type': 'success',
		'style': 'growl-top-right'
	});
	loadRecipesToDB(200, false);
	// console.log('Endless loop demo stopped!');
	return true;
}

Meteor.startup(function() {
	// Add new users
	var userDocs = [{
		"recipes": [],
		"subscription": [],
		"rating": 100,
		"username": "user1@gmail.com",
		"password": "asd",
		"email": "user1@gmail.com",
		"profile": {
			"name": "user1@gmail.com",
			"title": "Chef",
			"firstName": "John",
			"lastName": "User1",
			"affiliation": "Actively posting recipes",
			"position": "Chef cook 1",
			"summary": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
		}
	}, {
		"recipes": [],
		"subscription": [],
		"rating": 100,
		"username": "user2@gmail.com",
		"password": "asd",
		"email": "user2@gmail.com",
		"profile": {
			"name": "user2@gmail.com",
			"title": "Chef",
			"firstName": "Robert",
			"lastName": "User2",
			"affiliation": "Actively posting recipes",
			"position": "Chef cook 2",
			"summary": "Li Europan lingues es membres del sam familie. Lor separat existentie es un myth. Por scientie, musica, sport etc., li tot Europa usa li sam vocabularium. Li lingues differe solmen in li grammatica, li pronunciation e li plu commun vocabules. Omnicos directe al desirabilit? de un nov lingua franca: on refusa continuar payar custosi traductores. It solmen va esser necessi far uniform grammatica, pronunciation e plu sommun paroles.",
		}
	}, {
		"recipes": [],
		"subscription": [],
		"rating": 200,
		"username": "user3@gmail.com",
		"password": "asd",
		"email": "user3@gmail.com",
		"profile": {
			"name": "user3@gmail.com",
			"title": "",
			"firstName": "Michael",
			"lastName": "User3",
			"affiliation": "Subscribed to recipes news feed",
			"position": "",
			"summary": "Li Europan lingues es membres del sam familie. Lor separat existentie es un myth. Por scientie, musica, sport etc., li tot Europa usa li sam vocabularium. Li lingues differe solmen in li grammatica, li pronunciation e li plu commun vocabules. Omnicos directe al desirabilit? de un nov lingua franca: on refusa continuar payar custosi traductores. It solmen va esser necessi far uniform grammatica, pronunciation e plu sommun paroles.",
		}
	}]

	if (Meteor.users.find().count() == 0) {
		Meteor.users.remove({});
		Accounts.createUser(userDocs[0])
		Accounts.createUser(userDocs[1])
		Accounts.createUser(userDocs[2])
	}

	user1 = Meteor.users.findOne({
		'username': 'user1@gmail.com'
	});
	user2 = Meteor.users.findOne({
		'username': 'user2@gmail.com'
	});
	user3 = Meteor.users.findOne({
		'username': 'user3@gmail.com'
	});

	Meteor.users.update({
		'username': 'user3@gmail.com'
	}, {
		$addToSet: {
			'subscription': user1._id,
		}
	});
	Meteor.users.update({
		'username': 'user3@gmail.com'
	}, {
		$addToSet: {
			'subscription': user2._id
		}
	});

	// Clear recent alerts
	Journal.Alert.db.remove({});

	// Run demo once
	globalTimeouts.push(runDemoOnce(10000, 200, false));
});

Meteor.publish('alerts', function() {
	return Journal.Alert.db.find({}, {
		sort: {
			'_created': -1
		},
		limit: 1
	});
});

Meteor.methods({
	alert: function(bert, source, target) {
		var target = target ? Meteor.users.findOne({
			'username': target
		}) : {
			'username': 'all'
		};
		if (target) {
			Journal.Alert.db.insert({
				'_created': new Date(),
				'source': source || 'all',
				'target': target.username,
				'bert': bert
			}, function(error, result) {
				if (error) {
					console.log('Error inserting SDP message: ', error);
				} else {
					Meteor.setTimeout(function() {
						Journal.Alert.db.remove(result);
					}, 5000);
				}
			});
		};
	},
	startDemo: function() {
		return startDemo();
	},
	stopDemo: function() {
		return stopDemo();
	},
	setDemoMode: function(state) {
		demoMode = state;
		// console.log('Demo mode changed to: ', demoMode);
	},
	getDemoMode: function() {
		return demoMode;
	},
	subscribe: function(toUserId) {
		return Meteor.users.update({
			'_id': this.userId
		}, {
			$addToSet: {
				'subscription': toUserId
			}
		});
	},
	unsubscribe: function(userId) {
		return Meteor.users.update({
			'_id': this.userId
		}, {
			$pull: {
				'subscription': userId
			}
		});
	}
});
