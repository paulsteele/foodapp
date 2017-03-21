import {Meteor} from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import {check} from 'meteor/check';

export const Ingredients = new Mongo.Collection('ingredients');

if (Meteor.isServer){
	Meteor.publish('ingredients', function ingredientsPublication() {
		return Ingredients.find({
			owner: this.userId,
		}, {sort: {text: 1}});
	});

	Meteor.methods({
	'ingredients.insert'(text, count){
		check(text, String);
		check(count, Number);

		if (!this.userId){
			throw new Meteor.Error('not-authorized');
		}

		if (Ingredients.findOne({text: text, owner: this.userId}) != undefined){
			err = new Meteor.Error('already-exists');
			err.reason= "The ingredient already exists";
			throw err;
			return;
		}

		Ingredients.insert({
			text: text.toLowerCase(),
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

	'ingredients.getCount'(ingredient){
		check(ingredient, String);
		ingredient = ingredient.toLowerCase();
		if (!this.userId){
			throw new Meteor.Error('not-authorized');
		}

		var candidate = Ingredients.findOne({text: ingredient, owner: this.userId});
		if (candidate != undefined){
			return candidate.quantity;
		}
		else{
			return -1;
		}

	}
});
	
}

