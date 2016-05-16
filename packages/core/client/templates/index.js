Router.route('/', {
  name: 'index.page',
  onBeforeAction: function() {
    $('input#index_search').val('');
    this.next();
  }
});

