Router.configure({
	layoutTemplate: 'headerFooterLayout'
});

Template.registerHelper('isPkg', function(pkgName) {
	return Journal[pkgName] || undefined;
})

Template.registerHelper('prettyDate', function(date) {
	return date.toDateString() + ' ' + date.toLocaleTimeString();
})

Template.registerHelper('recipeAuthorName', function(recipeId) {
	var recipe = Journal.Recipe.db.findOne({
		'_id': recipeId
	});
	var user = recipe && recipe.private ? Meteor.users.findOne({
		'_id': recipe.private.author
	}) : null;
	return user ? user.profile.firstName + ' ' + user.profile.lastName : null;
})

Template.header.onCreated(function() {
	// Init
	var instance = this;
	// Autorun
	instance.autorun(function() {
		instance.subscribe('alerts');
		var alert = Journal.Alert.db.findOne();
		if (alert) {
			if (alert.source == 'all') {
				Bert.alert(alert.bert);
			} else {
				var user = Meteor.users.findOne({
					'_id': Meteor.userId(),
					'subscription': alert.source
				});
				if (user) {
					Bert.alert(alert.bert);
				}
			}
		}
	});
});

Template.footer.helpers({
	year: function() {
		return new Date().getFullYear();
	}
});