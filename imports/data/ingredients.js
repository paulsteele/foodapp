import {Meteor} from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import {check} from 'meteor/check';
import { Session } from 'meteor/session';

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

		if (Ingredients.findOne({text: text, owner: this.userId}) != undefined){
			err = new Meteor.Error('already-exists');
			err.reason= "The ingredient already exists";
			throw err;
			return;
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

	'ingredients.checkDeleteList'(entry){
		return (Session.get(entry) != null);
	},

	'ingredients.addDeleteList'(entry){
		Session.set(entry, true);
	},

	'ingredient.delDeleteList'(entry){
		delete Session.keys[entry];
	}
});