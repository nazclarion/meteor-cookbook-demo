Meteor.publish('recipeById', function(_id) {
	return Journal.Recipe.db.find({
		_id: _id
	}, {
		fields: {
			public: 1
		}
	})
});

Meteor.publish('publicRecipes', function() {
	return Journal.Recipe.db.find({}, {
		fields: {
			public: 1,
			private: 1
		}
	})
});

Meteor.publish('recipeByAuthor', function(recipeId) {
	return Journal.Recipe.db.find({
		'_id': recipeId,
		'private.author': this.userId
	}, {
		fields: {
			public: 1,
			private: 1
		}
	})
});

Meteor.methods({
	createRecipe: function(doc) {
		doc.public = _.extend({
			'title': '',
			'abstract': '',
			'status': 'active',
			'_created': new Date()
		}, doc.public);
		doc.private = _.extend({
			'author': Meteor.userId(),
			'reviews': [],
			'score': 0
		}, doc.private);

		// // Add logged in user to authors if it is not already in
		// var docSet = new Set(doc.private.authors);
		// if (!docSet.has(Meteor.userId())) {
		// 	doc.private.authors.push(Meteor.userId());
		// }

		// Insert new recipe document
		return Journal.Recipe.db.insert(doc, function(error, result) {
			if (error) {
				console.log('Error inserting new recipe: ', error);
				return error;
			} else {
				// Add recipe to user profile
				Meteor.users.update({
					_id: doc.private.author || ''
				}, {
					$push: {
						recipes: result
					}
				}, function(error, result) {
					if (error) {
						console.log('Recipe id NOT added to user profile: ', error);
					} else {
						// console.log('Recipe id added to user profile: ');
					}
				});

				return result;
			}
		});
	},
	stateRecipe: function(recipeId, state) {
		return Journal.Recipe.db.update({
			_id: recipeId
		}, {
			$set: {
				'public.status': state
			}
		})
	}
});

Journal.Recipe.create = function(recipeDoc) {
	return Meteor.call('createRecipe', recipeDoc);
}