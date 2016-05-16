Template.RegisterBlock.events({
	'submit form': function(event) {
		event.preventDefault();
		var userObj = {
			username: event.target.reg_email.value,
			password: event.target.reg_password.value,
			email: event.target.reg_email.value,
			profile: {
				name: event.target.reg_email.value,
				firstName: event.target.reg_firstName.value,
				lastName: event.target.reg_lastName.value,
				affiliation: event.target.reg_affiliation.value,
				// accountType: event.target.reg_accountType.value
			}
		};

		// Create new user from client
		Accounts.createUser(userObj, function(err) {
			if (err) {
				console.log('Error creating user: ', err);
			}
		})
	}
});