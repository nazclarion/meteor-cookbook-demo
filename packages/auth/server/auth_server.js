Accounts.onCreateUser(function(options, user) {
	user.profile = {};
	var default_public = {
		title: '',
		firstName: '',
		lastName: '',
		affiliation: '',
		position: '',
		summary: '',
		publications: [],
	}
	var default_private = {
		recipes: [],
		subscription: [],
		rating: options.rating || 0
	}
	user = _.extend(default_private, user);
	user.profile = _.extend(default_public, options.profile);
	return user;
});
