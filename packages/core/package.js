Package.describe({
  name: 'nazclarion:journal',
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
    'journal:lib', // no internal deps, all external dependencies
    'journal:auth', // lib
    'journal:user', // lib
    'journal:review',
    'journal:search',
    'journal:recipe',
    'nazclarion:feedparser'
  ]
  api.use(packages);
  api.imply(packages);

  api.addFiles('journal.js');
  api.addFiles([
    'client/templates/index.html',
    'client/templates/index.js',
    'client/templates/main.html',
    'client/templates/main.js',
    'client/templates/sitemap.html',
    'client/templates/sitemap.js',
    'client/stylesheets/w3.css',
    'client/stylesheets/w3-theme-blue-grey.css',
    'client/stylesheets/journal.css'
  ], 'client');
  api.addFiles('server/journal_server.js', 'server')
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('nazclarion:journal');
  api.addFiles('journal-tests.js');
});