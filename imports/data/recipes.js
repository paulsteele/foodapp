import {Meteor} from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import {check} from 'meteor/check';
import { Ingredients } from './ingredients.js'

export const Recipes = new Mongo.Collection('recipes');

export function recipe(name, ingredients, ingredients_counts, time, instructions){
	this.name = name;
	this.ingredients = ingredients;
	this.ingredients_counts = ingredients_counts
	this.time = time;
	this.instructions = instructions;
}
if (Meteor.isServer){
	Meteor.publish('recipes', function recipesPublication() {
		return Recipes.find({
			owner: this.userId,
		}, {sort: {text: 1}});
	});

	Meteor.publish('cookableRecipes', function cookableRecipesPublication() {
		//obtain all legal recipes that this user can have
		subset = Recipes.find({
			owner: this.userId,
		}, {sort: {text: 1}});

		//Don't want to store constantly
		validRecipes = new Mongo.Collection(null);

		subset.forEach((recipe) => {
			//check to see if recipe is valid
			//check every ingredient
			working = true;
			for (i = 0; i < recipe.ingredients.length; i++){
				//see if matching ingredient 
				var ingred = Ingredients.findOne({text: recipe.ingredients[i].toLowerCase(), owner: recipe.owner});
				//if actually valid
				if (ingred){
					if ( ingred.quantity - recipe.ingredients_counts[i] < 0){
						working = false;
						break;
					}
				}
				else{
					working = false;
				}
			}

			//working will only be true if every ingredient passed
			if (working){
				validRecipes.insert(recipe);
			}
		});

		return validRecipes.Cursor;

	});


	

	Meteor.methods({
		'recipes.insert'(recipe){
			
			//check validity
			check(recipe.name, String);
			for (i = 0; i < recipe.ingredients.length; i++){
				check(recipe.ingredients[i], String);
				check(recipe.ingredients_counts[i], Number);
			}
			check(recipe.time, Number);
			for (i = 0; i < recipe.instructions.length; i++){
				check(recipe.instructions[i], String);
			}

			if (!this.userId){
				throw new Meteor.Error('not-authorized');
			}

			if (Recipes.findOne({name: recipe.name, owner: this.userId}) != undefined){
				err = new Meteor.Error('already-exists');
				err.reason= "The recipe already exists";
				throw err;
				return;
			}

			Recipes.insert({
				name: recipe.name.toLowerCase(),
				ingredients: recipe.ingredients,
				ingredients_counts: recipe.ingredients_counts,
				owner: this.userId,
				time: recipe.time,
				instructions: recipe.instructions,
				createdAt: new Date()
			});

			return;
		},

		'recipes.remove'(recipeId){
		check(recipeId, String);

		Recipes.remove(recipeId);
	},
	});

}

