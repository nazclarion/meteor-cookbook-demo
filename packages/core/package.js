Package.describe({
  name: 'nazclarion:cookbook',
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
    'cookbook:lib', // no internal deps, all external dependencies
    'cookbook:auth', // lib
    'cookbook:user', // lib
    'cookbook:review',
    'cookbook:search',
    'cookbook:recipe',
  ]
  api.use(packages);
  api.imply(packages);

  api.addFiles('main.js');
  api.addFiles([
    'client/templates/index.html',
    'client/templates/index.js',
    'client/templates/main.html',
    'client/templates/main.js',
    'client/templates/demo.html',
    'client/templates/demo.js',
    'client/stylesheets/w3.css',
    'client/stylesheets/w3-theme-blue-grey.css',
    'client/stylesheets/main.css'
  ], 'client');
  api.addFiles('server/main-server.js', 'server')
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('nazclarion:cookbook');
  api.addFiles('main-tests.js');
});
