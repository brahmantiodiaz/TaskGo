function getValidationError(error) {
	const customError = {
		message: {},
	};

	if (error.errors) {
		error.errors.forEach((el) => {
			customError.message[el.path] = el.message;
		});
	} else {
		customError.message.global = error.message || "Something went wrong";
	}

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

function toIdr(num) {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
	}).format(num);
}

module.exports = { getValidationError, toIdr };
