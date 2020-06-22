let stud_id, pw, pw_confirm, email, last_classdate;
let login_stud_id, login_pw, login_form, edit_form;
let registration_inputs, registration_err_outputs;
let registration_err, login_err, isRegErr, isLoginErr;
let submit_registration, submit_login;
let registrationErrCheck = event => {
	isRegErr = false;
	for(let i = 0; i < registration_inputs.length; i++) {
		if(registration_inputs[i].value.length < 1) {
			registration_err.textContent = getRegistrationErrTxt(i);
			isRegErr = true; break;
		} else if(pw.value != pw_confirm.value) {
			registration_err.textContent = '* 비밀번호가 다릅니다';
			isRegErr = true;
		}
	}
	if(!isRegErr) {
		registration_err.textContent = '';
		submit_registration.disabled = false;
	} else {
		submit_registration.disabled = true;
	}
}
let loginErrCheck = event => {
	isLoginErr = false;
	if(login_stud_id.value.length < 1) {
		login_err.textContent = '* 학번을 입력해주세요';
		isLoginErr = true;
	} else if(login_pw.value.length < 1) {
		login_err.textContent = '* 비밀번호를 입력해주세요';
		isLoginErr = true;
	}
	if(!isLoginErr) {
		login_err.textContent = '';
		submit_login.disabled = false;
	} else {
		submit_login.disabled = true;
	}
};
function ready() {

	if(window.location.href.indexOf('registration_successful') != -1) {
		alert('가입되셨습니다. 기한은 종강일 당일까지입니다.');
		window.location.href = '/';
	}

	if(window.location.href.indexOf('login_successful') != -1) {
		login_form.style.display = 'none';
		edit_form.style.display = 'block';
	}

	stud_id = document.querySelector('.registration_cont input[name="stud_id"]');
	pw = document.querySelector('.registration_cont input[name="pw"]');
	pw_confirm = document.querySelector('.registration_cont input[name="pw_confirm"]');
	email = document.querySelector('.registration_cont input[name="email"]');
	last_classdate = document.querySelector('.registration_cont input[name="last_classdate"]');

	login_form = document.querySelector('form[name="login_form"]');
	edit_form = document.querySelector('form[name="edit_form"]');
	login_stud_id = document.getElementById('stud_id');
	login_pw = document.getElementById('pw');
	edit_form.style.display = 'none';

	registration_err = document.getElementById('registration_err');
	login_err = document.getElementById('login_err');

	submit_registration = document.getElementById('submit_registration');
	submit_login = document.getElementById('submit_login');
	submit_registration.disabled = submit_login.disabled = true;

	registration_inputs = [stud_id, pw, pw_confirm, email, last_classdate];
	registration_err_outputs = [
		'학번', 
		'비밀번호', 
		'비밀번호 확인', 
		'이메일', 
		'종강일'
	];

	registration_inputs.forEach(e => {
		e.onblur = registrationErrCheck;
	});

	[login_stud_id, login_pw].forEach(e => {
		e.onblur = loginErrCheck;
	});
}
function getRegistrationErrTxt(i) {
	return '* ' + registration_err_outputs[i] + '을 입력해주세요';
}
