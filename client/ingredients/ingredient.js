import { Template } from 'meteor/templating';

import './ingredient.html';

import { Ingredients } from '../../imports/data/ingredients.js'

Template.ingredients.onCreated(function ingreidentsOnCreated(){
	Meteor.subscribe('ingredients');
});

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
	const count = target.count.value;
	//do actual insertion into mongo
	Meteor.call('ingredients.insert', text, parseInt(count), function(err){
		if (err){
			Session.set('errorMessage', err.reason);
		}
	});
	
	//clear form value
	target.text.value = '';
	},
});