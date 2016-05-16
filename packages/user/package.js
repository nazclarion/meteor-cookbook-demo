Package.describe({
  name: 'journal:user',
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

  api.addFiles('user.js');
  api.addFiles([
    'client/stylesheets/user.css',
    'client/templates/user_profile.html',
    'client/templates/user_profile.js'
  ], 'client');
  api.addFiles([
    'server/user_server.js'
  ], 'server')
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('journal:user');
  api.addFiles('user-tests.js');
});