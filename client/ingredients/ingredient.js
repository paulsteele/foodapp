import { Template } from 'meteor/templating';
import { Ingredients } from '../../imports/data/ingredients.js'
import { ReactiveDict } from 'meteor/reactive-dict';

import './ingredient.html';

Template.ingredients.onCreated(function ingreidentsOnCreated(){
	Meteor.subscribe('ingredients');
});

Template.ingredient_entry.onCreated(function ingredient_entryOnCreated(){
	this.show_remove = new ReactiveVar(false);
	this.show_update = new ReactiveVar(false);
});

Template.ingredients.helpers({
	ingredient_list() {
		return Ingredients.find({});
	},
});

Template.ingredient_entry.helpers({
	check_show_remove() {
		return Template.instance().show_remove.get();
	},

	check_show_update() {
		return Template.instance().show_update.get();
	},
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

Template.ingredient_entry.events({

	'change .count': function(event, template){
		
		const target = event.target;
		const count = target.value;
		if (parseInt(count) != this.quantity){
			template.show_update.set(true);
		}
		else {
			template.show_update.set(false);
		}
		
	},

	'click .delete': function(event, template){
		template.show_remove.set(true);
	},

	'click .delete_confirm' : function(event, template){
		Meteor.call('ingredients.remove', this._id, function(err){
			if (err){
				Session.set('errorMessage', err.reason);
			}
		});
	},

	'click .delete_deny' : function(event, template){
		template.show_remove.set(false);
	},

	'click .update_confirm' : function(event, template){ 
		//this is really stupid looking but essentially walks down the template children to find
		//the numberbox
		const count = $(event.target).parent().parent().parent()[0].children[0].cells[1].children[0].value;

		Meteor.call('ingredients.setCount', this._id, parseInt(count), function(err){
			if (err){
				Session.set('errorMessage', err.reason);
			}
		});

		template.show_update.set(false);
	},

	'click .update_deny' : function(event, template){
		$(event.target).parent().parent().parent()[0].children[0].cells[1].children[0].value = this.quantity;
		template.show_update.set(false);
	}
});
