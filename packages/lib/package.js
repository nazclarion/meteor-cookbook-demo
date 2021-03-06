Package.describe({
  name: 'cookbook:lib',
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
    'iron:router@1.1.2',
    'reactive-var',
    'accounts-base',
    'accounts-password',
    'templating',
    'ecmascript',
    'underscore',
    'check',
    'ejson',
    'meteorhacks:search-source@1.4.2'
  ]

  api.use(packages);
  api.imply(packages);

  api.addFiles('lib.js');

  api.export('Journal');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('cookbook:lib');
  api.addFiles('lib-tests.js');
});
