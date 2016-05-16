Router.route('/recipe/:id', {
	name: 'recipe.page',
	subscriptions: function() {
		this.subscribe('userById', Meteor.userId());
		this.subscribe('publicUsers');
		this.subscribe('recipeById', this.params.id);
		this.subscribe('recipeByAuthor', this.params.id);
		this.subscribe('reviewByRecipe', this.params.id);
	},
})

Template.RecipePage.onCreated(function() {
	Session.set('recipe_menuTab', 'recipe_info');
});

Template.RecipePage.helpers({
	tab: function() {
		return Session.get('recipe_menuTab');
	},
	'isState': function(state) {
		var recipe = Journal.Recipe.db.findOne({
			_id: Router.current().params.id
		});
		return recipe ? recipe.public.status === state : false;
	},
	'isAuthor': function() {
		return Journal.Recipe.db.findOne({
			'_id': Router.current().params.id,
			'private.author': Meteor.userId()
		})
	},
});

Template.RecipePage.events({
	'click .sg-view': function(event, template) {
		event.stopPropagation();
		event.preventDefault();
		Session.set('recipe_menuTab', $(event.target).data('template'));
		if ($(event.target).data('template') === 'recipe_info') {
			$('.sg-toggle').show();
		} else {
			$('.sg-toggle').hide();
		}
	}
});

Template.recipe_info.helpers({
	recipeProfile: function() {
		var recipe = Journal.Recipe.db.findOne({
			_id: Router.current().params.id
		});
		if (!recipe) {
			Router.go('sitemap.page');
		}
		return recipe && recipe.public ? recipe.public : [];
	}
});

Template.recipe_review_tool.helpers({
	reviewCriteria: function() {
		return [{
			name: "Appeal",
			scale: 100
		}, {
			name: "Taste",
			scale: 100
		}, {
			name: "Ingredients",
			scale: 100
		}, {
			name: "Nutrition",
			scale: 100
		}, {
			name: "Instructions",
			scale: 100
		}, {
			name: "Presentation",
			scale: 100
		}]
	}
});

Template.recipe_review_tool.events({
	'input .review-range-slider': function(event) {
		var full = 200,
			val = parseInt(full * event.target.value / 100),
			r = full - val,
			g = val,
			b = 55;
		$(event.target).siblings('span').html(event.target.value).css("background-color", "rgb(" + r + "," + g + "," + b + ")", 'important');
	},
	'submit form': function(event) {
		event.preventDefault();
		var reviewDoc = {
			public: {
				recipeId: Router.current().params.id,
				comment: $(event.target).find('[name="recipe-review-comment"]').val()
			},
			private: {
				marks: [],
			}
		};
		$(event.target).find('input[type="range"]').each(function(_, slider) {
			reviewDoc.private.marks.push({
				key: slider.name,
				value: slider.value
			});
		});
		Meteor.call('createReview', reviewDoc, function(error, result) {
			if (error) {
				console.log(error)
			}
		});
		Session.set('recipe_menuTab', 'recipe_review_tool_done');
	}
});

Template.recipe_review_stat.helpers({
	dataReview: function() {
		return Journal.Review.db.find({}).fetch().map(function(el) {
			var authorObject = Meteor.users.findOne({
				'_id': el.private.author
			});
			return {
				'_id': el._id,
				'username': authorObject.profile.firstName + ' ' + authorObject.profile.lastName,
				'comment': el.public.comment,
				'score': parseInt(el.private.marks.reduce(function(sum, a) {
					return sum + parseInt(a.value);
				}, 0) / (el.private.marks.length || 1)),
				'rating': authorObject ? authorObject.rating : 0
			};
		})
	},
	consensusScore: function() {
		var recipe = Journal.Recipe.db.findOne({
			'_id': Router.current().params.id
		});
		return recipe ? recipe.private.score : 0;
	},
	'isAuthor': function() {
		return Journal.Recipe.db.findOne({
			'_id': Router.current().params.id,
			'private.author': Meteor.userId()
		})
	},
	'isState': function(state) {
		var recipe = Journal.Recipe.db.findOne({
			_id: Router.current().params.id
		});
		return recipe ? recipe.public.status === state : false;
	}
});

Template.recipe_review_stat.events({
	'click .sg-state': function(event) {
		Meteor.call('stateRecipe', Router.current().params.id, $(event.target).data("state"), function(error, result) {
			if (error) {
				console.log('Error changing state: ', error);
			}
		});
	},
	'click #removeOfferById.sg-action': function(event) {
		Meteor.call('removeOfferById', $(event.target).data("id"), function(error, result) {
			if (error) {
				console.log('Error deleting offer: ', error);
			}
		});
	},
	'change [name="acceptOffer"].sg-action': function(event) {
		Meteor.call('acceptOffer', Router.current().params.id, $(event.target).data('id'), function(error, result) {
			if (error) {
				console.log('Error accepting an offer: ', error);
			} else {
				Meteor.call('stateRecipe', Router.current().params.id, "suspended", function(error, result) {
					if (error) {
						console.log('Error changing state: ', error);
					}
				});
			}
		});
	}
});