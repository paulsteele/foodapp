import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

import './main.html';

Template.body.helpers({
	'contextCheck': function(value){
		if (Session.get('pageContext') == value){
			return true;
		}
		else {
			return false;
		}
	},
});

Template.registerHelper('errorValue', function() {
	return Session.get('errorMessage');
});

Template.registerHelper('userID', function() {
		return Meteor.user();
});

Template.registerHelper('cookingRecipe', function(){
	return Session.get('cookingRecipe');
});

//stores a variable that can be used to determine context of how the page should look
Meteor.startup(function() {
	Session.set('pageContext', null);
	Session.set('errorMessage', null);
	Session.set('cookingRecipe', null);
});