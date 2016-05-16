Template.LoginBlock.events({
	'submit form': function(event) {
		event.preventDefault();
		Meteor.loginWithPassword(event.target.loginEmail.value, event.target.loginPassword.value, function(err) {
			if (err) {
				console.log('Error signing in: ', err);
			}
			Session.keys = {};
			Router.go('profile.page', {id: Meteor.userId()});
		});
	}
});

Template.LoggedBlock.events({
	'click #signOut_btn': function(event) {
		event.preventDefault();
		Meteor.logout();
		Session.keys = {};
		Router.go('index.page');
	},
	'click #profile_btn': function(event) {
		event.preventDefault();
		Router.go('profile.page', {id: Meteor.userId()});
	}
});

Template.LoggedBlock.helpers({
	loggedName: function() {
		return Meteor.user().username;
	}
});