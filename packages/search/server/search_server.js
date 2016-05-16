// Search Source Users
SearchSource.defineSource('searchUsers', function(searchText, options) {
  var selector = {},
    options = options || {};

  if (searchText) {
    var regExp = buildRegExp(searchText);
    var selector = {
      $or: [{
        'profile.firstName': regExp
      }, {
        'profile.lastName': regExp
      }, {
        summary: regExp
      }]
    };
  }
  return Meteor.users.find(selector, options).fetch();
});

// Search Source Recipes
SearchSource.defineSource('searchRecipes', function(searchText, options) {
  var selector = {},
    options = options || {};

  if (searchText) {
    var regExp = buildRegExp(searchText);
    var selector = {
      $or: [{
        'public.title': regExp
      }, {
        'public.abstract': regExp
      }]
    };
  }
  return Journal.Recipe.db.find(selector, options).fetch();
});

function buildRegExp(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}