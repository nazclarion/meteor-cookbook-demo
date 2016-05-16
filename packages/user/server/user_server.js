Meteor.publish('userById', function(_id) {
	return Meteor.users.find({
		_id: _id
	}, {
		fields: (_id === this.userId) ? {
			'profile': 1,
			'rating': 1,
			'subscription': 1,
			'recipes': 1
		} : {
			'rating': 1,
			'profile': 1
		}
	})
});

Meteor.publish('publicUsers', function() {
	return Meteor.users.find({}, {
		fields: {
			'profile': 1,
			'rating': 1
		}
	})
})