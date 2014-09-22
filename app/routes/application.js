export default Ember.Route.extend({
  notifications: [],

  setupController: function (controller) {
    controller.set('notifications', this.get('notifications'));
    this._super.apply(this, arguments);
  },

  userChanged: function () {

    if (this.get('session.transition')) {
      this.get('session.transition').retry();
    } else {
      this.transitionTo('index');
    }

  }.observes('session.user'),

  actions: {
    logoutUser: function () {

      window.ENV.firebase.child('presence/online').child(this.get('session.user.uid')).remove();

      this.get('session.auth').logout();
      this.transitionTo('login');
    },

    notify: function (type, message, options) {

      options = options || {};

      var notifications = this.get('notifications'),
          notification = Ember.Object.create({
            className: 'wy-tray-item' + (type ? '-' + type : ''),
            message: message
          });

      if (options.icon) {
        notification.set('iconClass', 'icon icon-' + options.icon);
      }

      if (options.className) {
        notification.set('extraClassName', options.className);
      }

      notifications.pushObject(notification);

      Ember.run.later(this, function () {
        notification.set('state', 'on');
      }, 10);

      Ember.run.later(this, function () {
        notification.set('state', null);
      }, 4500);

      Ember.run.later(this, function () {
        notifications.removeObject(notification);
      }, 5000);

    },

    chooseLanguage: function (language) {
      Ember.Logger.log('Changing language to %@'.fmt(language));
      window.localStorage.setItem('webhook-cms-language', language);

      Ember.Logger.log('Resetting app.');
      window.App.reset();
    }
  }
});
