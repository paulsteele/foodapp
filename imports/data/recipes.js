import {Meteor} from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import {check} from 'meteor/check';

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


	Meteor.methods({
		'recipes.insert'(recipe){

			return;
		}
	});

}

