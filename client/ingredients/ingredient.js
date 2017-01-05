import { Template } from 'meteor/templating';

import './ingredient.html';

import { Ingredients } from '../../imports/data/ingredients.js'

Template.ingredients.helpers({
	ingredient_list() {
		return Ingredients.find({});
	}
});

Template.ingredients.events({
	'submit .new_ingredient'(event){
	event.preventDefault();

	//Grab the values
    const target = event.target;
	const text = target.text.value;
	//do actual insertion into mongo
	Ingredients.insert({
		text,
		createdAt: new Date()
	});
	
	//clear form value
	target.text.value = '';
	},
});