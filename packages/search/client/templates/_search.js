Router.route('/search', {
	name: 'search.page',
	subscriptions: function() {
		this.subscribe('userById', this.params.id);
		this.subscribe('userById', Meteor.userId());
		this.subscribe('publicUsers');
		this.subscribe('publicRecipes');
	},
	onAfterAction: function() {
		$('input#index_search')
			.val(Router.current().params.query.q || "")
			.trigger('input')
			.focus();
	}
});

// Search Users
UserSearch = new SearchSource('searchUsers', ['profile.firstName', 'profile.lastName', 'summary'], {
	keepHistory: 1000 * 60 * 5,
	localSearch: true
});

// Search Recipes
RecipeSearch = new SearchSource('searchRecipes', ['public.title', 'public.abstract'], {
	keepHistory: 1000 * 60 * 5,
	localSearch: true
});

function updateSearch(text, options) {
	var text = text || $('#index_search').val().trim(),
		options = options || {
			sort: {
				title: -1
			},
			limit: 20
		};
	UserSearch.search(text, options);
	RecipeSearch.search(text, options);
}

Template.searchForm.onRendered(function() {
	$('input#index_search')
		.val(Router.current().params.query.q || "")
		.trigger('input')
		.focus();
})

Template.SearchPage.onRendered(function() {
	$('input#index_search')
		.val(Router.current().params.query.q || "")
		.trigger('input')
		.focus();
});

Template.SearchPage.helpers({
	searchResults: function() {
		var results = [];
		var userResults = UserSearch.getData({
			// transform: function(matchText, regExp){
			//   return matchText.replace(regExp, "<b>$&</b>");
			// },
			sort: {
				rating: -1
			}
		}, true).map(function(el) {
			return {
				'title': el.profile.firstName + ' ' + el.profile.lastName,
				'tags': ["User", "Rating: " + el.rating],
				'url': '/profile/' + el._id,
				'text': el.summary
			}
		});
		var recipeResults = RecipeSearch.getData({
			// transform: function(matchText, regExp){
			//   return matchText.replace(regExp, "<b>$&</b>");
			// },
			sort: {
				'private.score': -1
			}
		}, true).map(function(el) {
			return {
				'title': el.public.title,
				'tags': ["Recipe", el.public.status],
				'url': '/recipe/' + el._id,
				'text': el.public.abstract
			}
		});

		return $('#index_search').val() ? results.concat(undefined, userResults, recipeResults) : [];
	}
});

Template.searchForm.events({
	'input #index_search': _.debounce(function(event) {
		updateSearch();
	}, 200),
	'submit form#_search': function(event) {
		event.preventDefault();
		Router.go('/search?q=' + encodeURIComponent(event.target.searchText.value));
	},
});