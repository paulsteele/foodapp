import './user.html';

Template.user_create_header.events({
	'click #user_create_header' (event){
		Session.set('pageContext', 'signup');
	},
});

Template.user_login_header.events({
	'click #user_login_header' (event){
		Session.set('pageContext', 'login');
	},
});

Template.user_logout_header.events({
	'click #user_logout_header' (event){

	},
});