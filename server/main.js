import { Meteor } from 'meteor/meteor';
//import data functions
import '../imports/data/ingredients.js';
import '../imports/data/recipes.js';

//Iron router configuration
Router.configure({
	noRoutesTemplate: 'noRoutesTemplate'
});


Meteor.startup(() => {
  // code to run on server at startup
});