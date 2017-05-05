import { Template } from 'meteor/templating';
import { Recipes } from '../../imports/data/recipes.js';
import { Random } from 'meteor/random';

cookableRecipes = new Meteor.Collection(null);
var inprocess = false;

Template.suggest.onCreated(function bodyOnCreated(){
	inprocess = false;
});

Template.suggest.helpers({
	cookable_show() {
		var size = cookableRecipes.find().count();
		if ( size != 0){
			if (inprocess){
				//handle selecting the candidate here, because this will get updated whenever the 
				//collection size changes (when we say no to an item it will removed from the collection)
				var entry = Math.floor(Math.random() * size);
				var recipe_array = cookableRecipes.find().fetch();
				Session.set('cookingCandidate', recipe_array[entry]);
				return true;
			}
			else{
				return false;
			}
			
		}
		else{
			return false;
		}
	},
});

Template.suggest.events({
	'click #suggestRecipe' : function(event){
		
		if (inprocess == false){
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

			inprocess = true;

		}
		else{
			cookableRecipes.remove(Session.get('cookingCandidate'));
			if (cookableRecipes.find().count() == 0){
				inprocess = false;
			}
		}
	},

	'click #cancel_suggest' : function(event){
		cookableRecipes.remove({});
		inprocess = false;
	},

	'click #cook_recipe' : function(event){
		inprocess = false;
		Session.set('cookingRecipe', Session.get('cookingCandidate'));
	}
});