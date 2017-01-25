import { Template } from 'meteor/templating';
import { Ingredients } from '../../imports/data/ingredients.js'
import { ReactiveDict } from 'meteor/reactive-dict';

import './recipe.html';

Template.recipes.onCreated(function ingreidentsOnCreated(){
	Meteor.subscribe('ingredients');
});

Template.recipes.onCreated(function ingredient_entryOnCreated(){
	this.show_new_recipe = new ReactiveVar(false);
});

Template.recipes.helpers({
	check_show_new_recipe() {
		return Template.instance().show_new_recipe.get();
	},
});

Template.recipes.events({

	'click .new_recipe': function(event, template){
		template.show_new_recipe.set(true);
	},
});