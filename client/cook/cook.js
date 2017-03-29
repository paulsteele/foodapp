import { Template } from 'meteor/templating';
import { Recipes } from '../../imports/data/recipes.js';
import { recipe } from '../../imports/data/recipes.js';
import { Ingredients } from '../../imports/data/ingredients.js'

import './cook.html';

Template.cook.onCreated(function cookOnCreated(){

});

Template.cook.helpers({

});

Template.cook.events({
	'click #cook_cancel' : function(event, template){
		Session.set('cookingRecipe', null);
	},

	'submit #cook_form' : function(event, template){
		event.preventDefault();
		const target = event.target;
		const checkbox = target.checkbox;
		const checked = checkbox.checked;

		if (checked){
			//remove ingredients from inventory
			var recipe = Session.get('cookingRecipe');
			for (i = 0; i < recipe.ingredients.length; i++){
				const ingredient_name = recipe.ingredients[i];
				const ingredient_count = recipe.ingredients_counts[i];
				Meteor.call('ingredients.getCount', recipe.ingredients[i], function(err, result){
					if (err){
						Session.set('errorMessage', err.reason);
						return;
					}
					else{
						if (result != -1){
							var new_count = result - ingredient_count;
							if (new_count < 0){
								new_count = 0;
							}

							Meteor.call('ingredients.setCountByName', ingredient_name, new_count, function(err, result){
								if (err){
									Session.set('errorMessage', err.reason);
									return;
								}
							});
						}
					}
				});
			}
		}

		//remove the view regardless
		Session.set('cookingRecipe', null);
	}
});