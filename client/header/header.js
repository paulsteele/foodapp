import './header.html';

Template.errorHandler.events({
	'click #errorDismiss' (event){
		Session.set('errorMessage', null);
	},
});