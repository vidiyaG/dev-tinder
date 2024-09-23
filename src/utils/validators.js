const validator = require("validator");
validateSignupInput = (data) => {
    if (!data.firstName || !data.lastName) {
        throw new Error("Invalid firstname / lastname");
    } else if (!data.email || (data.email && !validator.isEmail(data.email))) {
        throw new Error("Invalid email");
    } else if (
        !data.password ||
        (data.password && !validator.isStrongPassword(data.password))
    ) {
        throw new Error("Invalid / weak password");
    }
};

const validateLoginInput = (data) => {
    if (!data.email || (data.email && !validator.isEmail(data.email))) {
        throw new Error("Invalid email");
    } else if (!data.password) {
        throw new Error("Invalid password");
    }
};

const validateUpdateProfileData = (data) => {
    const allowedFieldsToEdit = [
        "firstName",
        "lastName",
        "age",
        "gender",
        "imageUrl",
        "skills",
    ];
    const allFieldsValid = Object.keys(data).every((field) =>
        allowedFieldsToEdit.includes(field)
    );
    if (!allFieldsValid) {
        throw new Error("Invalid data");
    }
};
module.exports = {
    validateSignupInput,
    validateLoginInput,
    validateUpdateProfileData,
};
