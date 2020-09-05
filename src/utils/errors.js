/*
	error messages used in: addForm, loginForm, registerForm
*/
const errors = {
	empty: "Please fill out this field",
	special: "Special characters not allowed",
	email: "Invalid email",
	password: (length) =>  { return "Password must be at least " + length + "characters long" },
	passwordConfirm: "Passwords do not match",
	login: "Incorrect email or password",
}

export default errors;
