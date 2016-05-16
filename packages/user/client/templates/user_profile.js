Router.route('/profile/:id', {
	name: 'profile.page',
	subscriptions: function() {
		this.subscribe('userById', this.params.id);
		this.subscribe('userById', Meteor.userId());
	},
	onBeforeAction: function() {
		if (!Meteor.userId()) {
			this.render('please_login_page');
		} else {
			$('input#index_search').val('');
			this.next();
		}
	}
});

function menuTabName() {
	return Router.current().params.id + '_menuTab';
}

Template.ProfilePage.onRendered(function() {
	Session.set(menuTabName(), Session.get(menuTabName()) || 'profile_info');
	$('ul#side-nav li').each(function() {
		if ($(this).data('template') === (Session.get(menuTabName()) || 'profile_info')) {
			$(this).toggleClass('active', true);
		} else {
			$(this).toggleClass('active', false);
		}
	})
})

Template.ProfilePage.helpers({
	tab: function() {
		return Session.get(menuTabName());
	},
	isOwner: function() {
		return Router.current().params.id === Meteor.userId();
	}
});

Template.ProfilePage.events({
	'click ul#side-nav li': function(event, template) {
		event.stopPropagation();
		var targetMenu = $(event.target);
		targetMenu.toggleClass('active', true);
		$('ul#side-nav li').not(targetMenu).toggleClass('active', false);
		Session.set(menuTabName(), targetMenu.data('template'));
	}
});

Template.profile_info.helpers({
	userProfile: function() {
		var user = Meteor.users.findOne({
			_id: Router.current().params.id
		});
		return user ? user : undefined;
	}
});

Template.profile_recipes.onCreated(function() {
	// Init
	var instance = this;
	// Autorun
	instance.autorun(function() {
		instance.subscribe('publicRecipes');
	});
});

Template.profile_recipes.helpers({
	userRecipes: function() {
		var user = Meteor.user();
		if (user && user.recipes) {
			return Journal.Recipe.db.find({
				'_id': {
					$in: user.recipes
				}
			}, {
				sort: {
					'public._created': -1
				}
			})
		}
	},
	'isState': function(state) {
		return this.public.status === state;
	}
})

Template.profile_recipes.events({
	'click button.changeRecipeState': function(event) {
		event.preventDefault();
		Meteor.call('stateRecipe', $(event.currentTarget).attr('id'), $(event.currentTarget).data('state'), function(error, result) {
			if (error) {
				console.log('Error changing recipe state: ', error);
			}
		});
	}
});

Template.newRecipe.events({
	'submit form#newRecipeForm': function(event) {
		event.preventDefault();
		var recipeDoc = {
			public: {
				title: '',
				abstract: ''
			},
			private: {}
		};
		$('form#newRecipeForm').serializeArray().forEach(function(el) {
			switch (el.name) {
				case 'newRecipe_title':
					recipeDoc.public.title = el.value;
					break;
				case 'newRecipe_abstract':
					recipeDoc.public.abstract = el.value;
					break;
			}
		});
		Meteor.call('createRecipe', recipeDoc, function(error, result) {
			if (error) {
				console.log(error);
			} else {
				$('li[data-template=profile_recipes]').trigger('click');
				// console.log('New recipe created: ', result);
			}
		})
	}
});