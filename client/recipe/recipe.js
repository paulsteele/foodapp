import { Template } from 'meteor/templating';
import { Recipes } from '../../imports/data/recipes.js';
import { recipe } from '../../imports/data/recipes.js';
import { Ingredients } from '../../imports/data/ingredients.js'
import { ReactiveDict } from 'meteor/reactive-dict';

import './recipe.html';
import '../../imports/functions/times.js'

Template.recipes.onCreated(function recipesOnCreated(){
	Meteor.subscribe('recipes');
	this.show_new_recipe = new ReactiveVar(false);
});

Template.recipes.helpers({
	check_show_new_recipe() {
		return Template.instance().show_new_recipe.get();
	},

	recipe_list() {
		return Recipes.find({});
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
		const recname = target.recname.value;
		const ingred = target.rec_ingred;
		var ingredient_list = [];
		for ( i = 0; i < ingred.length; i++){
			ingredient_list[i] = ingred[i].value;
		}
		const ingred_count = target.rec_ingred_count;
		var ingredient_count = [];
		for (i = 0; i < ingred_count.length; i++){
			ingredient_count[i] = parseInt(ingred_count[i].value);
		}
		const time = parseInt(target.rec_time.value);
		const instruc = target.rec_instruc;
		var instructions = [];
		for (i = 0; i < instruc.length; i++){
			instructions[i] = instruc[i].value;
		}

		var newrecipe = new recipe(recname, ingredient_list, ingredient_count, time, instructions);

		Meteor.call('recipes.insert', newrecipe, function(err){
			if (err){
				Session.set('errorMessage', err.reason);
				return;
			}

			template.show_new_recipe.set(false);
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

Template.recipe_entry.onCreated(function recipe_entry_OnCreated(){
	this.show_recipe = new ReactiveVar(false);
	this.show_delete_bar = new ReactiveVar(false);
	this.ingredient_inventory = [];
});

Template.recipe_entry.helpers({
	get_show(){
		return Template.instance().show_recipe.get();
	},

	get_show_delete(){
		return Template.instance().show_delete_bar.get();
	},
});

Template.recipe_entry.events({
	'click .top_row': function(event, template){
		if (template.show_recipe.get() == true){
			template.show_recipe.set(false);
		}
		else{
			template.show_recipe.set(true);
		}
	},

	'click #delete_recipe': function(event, template){
		template.show_delete_bar.set(true);
	},

	'click .delete_deny' : function(event, template){
		template.show_delete_bar.set(false);
	},

	'click .delete_confirm' : function(event, template){
		Meteor.call('recipes.remove', this._id, function(err){
			if (err){
				Session.set('errorMessage', err.reason);
			}
		});
	},

	'click #cook_recipe' : function(event, template){
		Session.set('cookingRecipe', this);
	}
});

Template.recipe_inner.onCreated(function recipe_inner_OnCreated(){

});

Template.recipe_inner.helpers({
	recipe_ingredient_list(object) {
		var ingreds = [];
		for (i = 0; i < object.ingredients.length; i++){
			var tuple = new Object();
			tuple.ingredient = object.ingredients[i];
			tuple.count = object.ingredients_counts[i];
			ingreds[i] = tuple;
		}
		return ingreds;
	},

	recipe_instruction_list(object){
		return object.instructions;
	},

	recipe_instruction_number(index){
		return index + 1;
	},

	recipe_check_have_ingredient(index, ingredient, desired){
		var temp = Template.instance();
		//get the ingredient
		var ingred = Ingredients.findOne({text: ingredient.toLowerCase(), owner: Meteor.userId()});

		if (ingred){
			if (ingred.quantity >= desired){
				return true;
			}
			else{
				return false;
			}
		}
		else{
			return false;
		}
	}
});