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
		Meteor.logout(function(err) {
			if (err){
				Session.set('errorMessage', err.reason);
			}
		});
	},
});

Template.user_create.events({
	'submit .account_submit'(event){
		event.preventDefault();
		
		//Grab the values
    	const target = event.target;
		const emailval = target.email.value;
		const passwordval = target.password.value;
		const passwordConf = target.passwordconf.value;

		if (passwordval != passwordConf){
			Session.set('errorMessage', 'The passwords do not match');
			return;
		}

		if (emailval == ''){
			Session.set('errorMessage', 'Please enter an email');
			return;
		}

		var count = (emailval.match(/@/g) || []).length;

		if (count != 1){
			Session.set('errorMessage', 'Please enter a valid email');
			return;
		}


		if (passwordval == ''){
			Session.set('errorMessage', 'Please enter a password');
			return;
		}

		var options = {
			email : emailval,
			password : passwordval,
		};

		Accounts.createUser(options, function(err){
			if (err){
				Session.set('errorMessage', err.reason);
			}
			else {
				target.email.value = '';
				target.password.value = '';
				target.passwordconf.value = '';
				Session.set('errorMessage', null);
			}
		});
	},
});

Template.user_login.events({
	'submit .account_submit'(event){
		event.preventDefault();
		//Grab the values
    	const target = event.target;
		const emailval = target.email.value;
		const passwordval = target.password.value;

		Meteor.loginWithPassword(emailval, passwordval, function(err){
			if (err){
				Session.set('errorMessage', err.reason);
			}
			else{
				target.email.value = '';
				target.password.value = '';
				Session.set('errorMessage', null);
			}
		});
	},
});