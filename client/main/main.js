import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

import './main.html';

Template.body.helpers({
	userID() {
		return Meteor.user();
	},

	'contextCheck': function(value){
		if (Session.get('pageContext') == value){
			return true;
		}
		else {
			return false;
		}
	},
});

//stores a variable that can be used to determine context of how the page should look
Meteor.startup(function() {
	Session.set('pageContext', null);
});

/*Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});
*/