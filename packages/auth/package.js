Package.describe({
  name: 'cookbook:auth',
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

  api.addFiles('auth.js');
  api.addFiles([
    'client/stylesheets/auth.css',
    'client/templates/_login.html',
    'client/templates/_login.js',
    'client/templates/_register.html',
    'client/templates/_register.js'
  ], 'client');
  api.addFiles([
    'server/auth_server.js'
  ], 'server')
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('cookbook:auth');
  api.addFiles('auth-tests.js');
});
