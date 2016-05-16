Router.route('/review/:id', {
  name:'review.page',
  subscriptions: function() {
    this.subscribe('userById', this.params.id);
    this.subscribe('userById', Meteor.userId());
    this.subscribe('publicReviews');
  },
  onBeforeAction: function() {
    if (!Meteor.userId()) {
      this.render('please_login_page')
    } else {
      $('input#index_search').val('');
      this.next();
    }
  }
});

Template.ReviewPage.helpers({
  reviewProfile: function() {
    var review = Journal.Review.db.findOne({
      _id: Router.current().params.id
    });
    return review && review.public ? review.public : [];
  }
});



