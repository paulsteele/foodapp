import { Template } from 'meteor/templating';

var CookableRecipes = new Meteor.Collection("cookableRecipes");

Template.suggest.onCreated(function bodyOnCreated(){
	Meteor.subscribe('cookableRecipes');
});

Template.suggest.helpers({
	cookable_recipes_list() {
		return CookableRecipes.find({});
	},
});