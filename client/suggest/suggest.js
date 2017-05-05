import { Template } from 'meteor/templating';
import { Recipes } from '../../imports/data/recipes.js';

cookableRecipes = new Meteor.Collection(null);

Template.suggest.onCreated(function bodyOnCreated(){
	
});

Template.suggest.helpers({
	cookable_recipes_list() {
		return cookableRecipes.find({});
	},
});

Template.suggest.events({
	'click #suggestView' : function(event){
		Meteor.call('recipes.findCookable', function(err, result){
			if (err){
				Session.set('errorMessage', err.reason);
				return;
			}
			//clear cookable Recipes
			cookableRecipes.remove({});
			//put everything into cookableRecipes
			for (i = 0; i < result.length; i++){
				//convert id into recipe
				var inserter = Recipes.findOne({'_id' : result[i]});
				//insert it
				cookableRecipes.insert(inserter);
			}
		});
	}
});