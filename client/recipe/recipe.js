import { Template } from 'meteor/templating';
import { Recipes } from '../../imports/data/recipes.js';
import { recipe } from '../../imports/data/recipes.js';
import { ReactiveDict } from 'meteor/reactive-dict';

import './recipe.html';
import '../../imports/functions/times.js'

Template.recipes.onCreated(function ingreidentsOnCreated(){
	Meteor.subscribe('recipes');
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

	'click #discard_recipe' : function(event, template){
		template.show_new_recipe.set(false);
	},

	'submit .recipe_new' : function(event, template){
		
		event.preventDefault();
		const target = event.target;
		const recname = target.recname;
		const ingred = target.rec_ingred;
		const ingred_count = target.rec_ingred_count;
		const time = target.rec_time;
		const instruc = target.rec_instruc;
		console.log(instruc);

		var newrecipe = new recipe("hbvi", ["dhdf", "dfd"], 180, ["lolwut"]);

		Meteor.call('recipes.insert', newrecipe, function(err){
		if (err){
			Session.set('errorMessage', err.reason);
		}
	});
	}
});

Template.new_recipe.onCreated(function newrecipe_OnCreated(){
 	this.ingredients_count = new ReactiveVar(1);
 	this.instructions_count = new ReactiveVar(1);
});

Template.new_recipe.helpers({
	get_ingredients_count(){
		return Template.instance().ingredients_count.get();
	},

	get_instructions_count(){
		return Template.instance().instructions_count.get();
	},
});

Template.new_recipe.events({
	'click #addingredient': function(event, template){
		template.ingredients_count.set(template.ingredients_count.get() + 1);
	},

	'click #removeigredient' : function(event, template){
		value = template.ingredients_count.get() - 1;
		if (value < 0){
			value = 0;
		}
		template.ingredients_count.set(value);
	},
	'click #addinstruction': function(event, template){
		template.instructions_count.set(template.instructions_count.get() + 1);
	},

	'click #removeinstruction' : function(event, template){
		value = template.instructions_count.get() - 1;
		if (value < 0){
			value = 0;
		}
		template.instructions_count.set(value);
	},
});