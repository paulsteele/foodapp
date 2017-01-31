import { Template } from 'meteor/templating';
import { Ingredients } from '../../imports/data/ingredients.js'
import { ReactiveDict } from 'meteor/reactive-dict';

import './recipe.html';
import '../../imports/functions/times.js'

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
	'click #new_recipe': function(event, template){
		template.show_new_recipe.set(true);
	},
});

Template.new_recipe.onCreated(function newrecipe_OnCreated(){
 	this.ingredients_count = new ReactiveVar(1);
});

Template.new_recipe.helpers({
	get_ingredients_count(){
		return Template.instance().ingredients_count.get();
	}
});

Template.new_recipe.events({
	'click #addingredient': function(event, template){
		template.ingredients_count.set(template.ingredients_count.get() + 1);
	},

	'click #removeigredient' : function(event, template){
		template.ingredients_count.set(template.ingredients_count.get() - 1);
	}
});