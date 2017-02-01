import {Meteor} from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import {check} from 'meteor/check';

export const Recipes = new Mongo.Collection('recipes');

export function recipe(name, ingredients, time, instructions){
	this.name = name;
	this.ingredients = ingredients;
	this.time = time;
	this.instructions = instructions;
}
if (Meteor.isServer){
	Meteor.publish('recipes', function recipesPublication() {
		return Recipes.find({
			owner: this.userId,
		}, {sort: {text: 1}});
	});
}

Meteor.methods({
	'recipes.insert'(recipe){
		console.log(recipe.name);
	}
});