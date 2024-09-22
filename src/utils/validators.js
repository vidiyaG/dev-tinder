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
module.exports = {
    validateSignupInput,
    validateLoginInput,
};
