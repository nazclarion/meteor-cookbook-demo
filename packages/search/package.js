Package.describe({
  name: 'cookbook:search',
  version: '0.0.2',
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
    'cookbook:lib'
  ]

  api.use(packages);

  api.addFiles('search.js');
  api.addFiles([
    'client/templates/_search.html',
    'client/templates/_search.js',
    'client/stylesheets/_search.css'
  ], 'client');
  api.addFiles('server/search_server.js', 'server');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('cookbook:search');
  api.addFiles('search-tests.js');
});
