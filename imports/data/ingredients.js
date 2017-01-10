import {Meteor} from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import {check} from 'meteor/check';

export const Ingredients = new Mongo.Collection('ingredients');

if (Meteor.isServer){
	Meteor.publish('ingredients', function ingredientsPublication() {
		return Ingredients.find({
			owner: this.userId,
		});
	});
}

Meteor.methods({
	'ingredients.insert'(text, count){
		check(text, String);
		check(count, Number);

		if (!this.userId){
			throw new Meteor.Error('not-authorized');
		}

		Ingredients.insert({
			text,
			owner: this.userId,
			quantity: count,
			createdAt: new Date()
		});
	},

	'ingredients.remove'(ingredientId){
		check(ingredientId, String);

		Ingredients.remove(ingredientId);
	},

	'ingredients.setCount'(ingredientId, count){
		check(ingredientId, String);
		check(count, Number);

		Ingredients.update(ingredientId, { $set: { quantity: count}});
	},
});