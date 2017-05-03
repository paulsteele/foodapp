import { Template } from 'meteor/templating';

import CookableRecipes from '../../imports/data/recipes.js';

Template.suggest.onCreated(function bodyOnCreated(){
	Meteor.subscribe('cookableRecipes');
});

Template.suggest.helpers({
	cookable_recipes_list() {
		return CookableRecipes.Recipes.find({});
	},
});