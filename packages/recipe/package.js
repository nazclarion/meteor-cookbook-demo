Package.describe({
  name: 'journal:recipe',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');

  var packages = [
    'journal:lib'
  ]

  api.use(packages);

  api.addFiles('recipe.js');
  api.addFiles([
    'client/templates/_recipe.html',
    'client/templates/_recipe.js',
    'client/stylesheets/_recipe.css'
  ], 'client')

  api.addFiles([
    'server/recipe_server.js'
  ], 'server')
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('journal:recipe');
  api.addFiles('recipe-tests.js');
});