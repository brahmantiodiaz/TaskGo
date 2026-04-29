function getValidationError(error) {
	const customError = {
		message: {},
	};

	error.errors.forEach((el) => {
		customError.message[el.path] = el.message;
	});

	return customError;
}
function getErrors(error) {
	const customError = {
		message: {},
	};

	if (error.errors) {
		error.errors.forEach((el) => {
			customError.message[el.path] = el.message;
		});
	} else {
		customError.message.general = error.message || "Something went wrong";
	}
}

module.exports = getValidationError;
