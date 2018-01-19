Router.route('/demo', {
  name: 'demo.page',
  subscriptions: function() {
    this.subscribe('userById', this.params.id);
    this.subscribe('userById', Meteor.userId());
    this.subscribe('publicUsers');
  },
  onBeforeAction: function() {
    if (!Meteor.userId()) {
      this.render('please_login_page');
    } else {
      $('input#index_search').val('');
      this.next();
    }
  }
});

Template.DemoPage.onCreated(function() {
  // Init
  var instance = this;
  instance.demoMode = new ReactiveVar(false);

  instance.autorun(function() {
    instance.subscribe('alerts');
    var alert = Journal.Alert.db.findOne();
    if (alert) {
      Meteor.call('getDemoMode', function(error, result) {
        if (error) {
          console.log('GetDemoMode Error:', error);
        } else {
          instance.demoMode.set(result);
        }
      });
    }
    instance.subscribe('publicRecipes');
  })
});

Template.DemoPage.helpers({
  userList: function() {
    return Meteor.users.find({}, {
      sort: {
        'profile.lastName': 1
      }
    });
  },
  loggedIn: function(userId) {
    return Meteor.userId() == userId;
  },
  recipeList: function() {
    return Journal.Recipe.db.find({}, {
      sort: {
        'public._created': -1
      }
    });
  },
  demo: function() {
    return Template.instance().demoMode.get();
  },
  inSubscribed: function(userId) {
    var user = Meteor.users.findOne({
      '_id': Meteor.userId(),
      'subscription': userId
    });
    return user ? true : false;
  }
});

Template.DemoPage.events({
  'click #signInUser.sg-action': function(event) {
    event.stopPropagation();
    event.preventDefault();
    Meteor.loginWithPassword($(event.target).data('id'), 'asd', function(error) {
      if (error) {
        console.log('e', error)
      }
      Session.keys = {};
    });
  },
  'click #subscribe.sg-action': function(event, instance) {
    event.stopPropagation();
    event.preventDefault();
    Meteor.call('subscribe', $(event.target).data('id'), function(error, result) {
      if (error) {
        console.log('Subscribing error: ', error);
      }
    });
  },
  'click #unsubscribe.sg-action': function(event, instance) {
    event.stopPropagation();
    event.preventDefault();
    Meteor.call('unsubscribe', $(event.target).data('id'), function(error, result) {
      if (error) {
        console.log('Unsubscribing error: ', error);
      }
    });
  },
  'click #startDemo.sg-action': function(event, instance) {
    event.stopPropagation();
    event.preventDefault();
    Meteor.call('startDemo');
    Meteor.call('setDemoMode', true);
    instance.demoMode.set(true);
  },
  'click #stopDemo.sg-action': function(event, instance) {
    event.stopPropagation();
    event.preventDefault();
    Meteor.call('stopDemo');
    Meteor.call('setDemoMode', false);
    instance.demoMode.set(false);
  }
});
