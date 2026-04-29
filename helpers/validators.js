function requiredMessage(fieldName) {
	return `${fieldName} is required`;
}

function requiredString(DataTypes, fieldName) {
	return {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			notNull: {
				msg: requiredMessage(fieldName),
			},
			notEmpty: {
				msg: requiredMessage(fieldName),
			},
		},
	};
}

function requiredText(DataTypes, fieldName) {
	return {
		type: DataTypes.TEXT,
		allowNull: false,
		validate: {
			notNull: {
				msg: requiredMessage(fieldName),
			},
			notEmpty: {
				msg: requiredMessage(fieldName),
			},
		},
	};
}

function optionalText(DataTypes) {
	return {
		type: DataTypes.TEXT,
	};
}

function optionalString(DataTypes) {
	return {
		type: DataTypes.STRING,
	};
}

function requiredUrl(DataTypes, fieldName) {
	return {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			notNull: {
				msg: requiredMessage(fieldName),
			},
			notEmpty: {
				msg: requiredMessage(fieldName),
			},
			isUrl: {
				msg: `${fieldName} must be a valid URL`,
			},
		},
	};
}

function optionalUrl(DataTypes, fieldName) {
	return {
		type: DataTypes.STRING,
		validate: {
			isValidUrl(value) {
				if (!value) return;

				const isValid = /^https?:\/\/.+/i.test(value);

				if (!isValid) {
					throw new Error(`${fieldName} must be a valid URL`);
				}
			},
		},
	};
}

function requiredInteger(DataTypes, fieldName, minValue = null) {
	const validate = {
		notNull: {
			msg: requiredMessage(fieldName),
		},
		isInt: {
			msg: `${fieldName} must be an integer`,
		},
	};

	if (minValue !== null) {
		validate.min = {
			args: [minValue],
			msg: `${fieldName} minimum value is ${minValue}`,
		};
	}

	return {
		type: DataTypes.INTEGER,
		allowNull: false,
		validate,
	};
}

function optionalInteger(DataTypes, fieldName, minValue = null) {
	const validate = {
		isInt: {
			msg: `${fieldName} must be an integer`,
		},
	};

	if (minValue !== null) {
		validate.min = {
			args: [minValue],
			msg: `${fieldName} minimum value is ${minValue}`,
		};
	}

	return {
		type: DataTypes.INTEGER,
		validate,
	};
}

function requiredDate(DataTypes, fieldName) {
	return {
		type: DataTypes.DATE,
		allowNull: false,
		validate: {
			notNull: {
				msg: requiredMessage(fieldName),
			},
			isDate: {
				msg: `${fieldName} must be a valid date`,
			},
		},
	};
}

function optionalDate(DataTypes, fieldName) {
	return {
		type: DataTypes.DATE,
		validate: {
			isDate: {
				msg: `${fieldName} must be a valid date`,
			},
		},
	};
}

function enumString(DataTypes, fieldName, enumObj, defaultValue) {
	return {
		type: DataTypes.STRING,
		allowNull: false,
		defaultValue,
		validate: {
			notNull: {
				msg: requiredMessage(fieldName),
			},
			notEmpty: {
				msg: requiredMessage(fieldName),
			},
			isIn: {
				args: [Object.values(enumObj)],
				msg: `${fieldName} must be one of: ${Object.values(enumObj).join(", ")}`,
			},
		},
	};
}

module.exports = {
	requiredString,
	requiredText,
	optionalText,
	optionalString,
	requiredUrl,
	optionalUrl,
	requiredInteger,
	optionalInteger,
	requiredDate,
	optionalDate,
	enumString,
};
