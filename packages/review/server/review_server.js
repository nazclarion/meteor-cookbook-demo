Meteor.publish('publicReviews', function() {
	return Journal.Review.db.find({}, {
		fields: {
			public: 1
		}
	})
});

Meteor.publish('reviewById', function(reviewId) {
	return Journal.Review.db.find({
		_id: reviewId
	}, {
		fields: {
			public: 1
		}
	})
});

Meteor.publish('reviewByAuthor', function(authorId) {
	return Journal.Review.db.find({
		'private.author': authorId
	}, {
		fields: this.userId == authorId ? {
			public: 1,
			private: 1
		} : {
			public: 1
		}
	});
});

Meteor.publish('reviewByRecipe', function(recipeId) {
	var recipe = Journal.Recipe.db.findOne({
		'_id': recipeId
	});
	return Journal.Review.db.find({
		'public.recipeId': recipeId
	}, {
		fields: recipe && recipe.private.author == this.userId ? {
			public: 1,
			private: 1
		} : {
			public: 1
		}
	});
});

Meteor.methods({
	createReview: function(doc) {
		doc.private.author = doc.private.author || Meteor.userId();
		return Journal.Review.db.insert(doc, function(error, result) {
			if (error) {
				console.log('Error creating review: ', error);
			} else {
				var reviews = Journal.Review.db.find({
					'public.recipeId': doc.public.recipeId
				}).fetch();

				var recipeScore = reviews.length ?
					parseInt(reviews.reduce(function(sum, review) {
						return sum + parseInt(review.private.marks.reduce(function(marksSum, mark) {
							return marksSum + parseInt(mark.value)
						}, 0) / (review.private.marks.length || 1))
					}, 0) / (reviews.length || 1)) : 0;

				Journal.Recipe.db.update({
					'_id': doc.public.recipeId
				}, {
					$set: {
						'private.score': recipeScore
					}
				}, function(error, result) {
					if (error) {
						console.log('Error updating recipeScore: ', error);
					}
				});
				return result;
			}
		})
	}
});

Journal.Review.create = function(reviewDoc) {
	return Meteor.call('createReview', reviewDoc, function(error, result) {
		if (error) {
			console.log('Error creating review: ', error);
			return error;
		} else {
			return result;
		}
	});
}