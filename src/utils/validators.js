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

const validateConnectionReqData = (data) => {
    if (!data.status) {
        throw new Error("Status is required");
    } else if (data.status) {
        const allowedStatus = [
            "ignored",
            "interested",
            // "accepted", "rejected"
        ];
        const isValid = allowedStatus.includes(data?.status);
        if (!isValid) {
            throw new Error("Invalid Status " + data?.status);
        }
    } else if (!data.toUserId) {
        throw new Error("toUserId is required");
    }
};

const validateConnectionReviewData = (data) => {
    if (!data.status) {
        throw new Error("Status is required");
    } else if (data.status) {
        const allowedStatus = ["accept", "reject"];
        const isValid = allowedStatus.includes(data?.status);
        if (!isValid) {
            throw new Error("Invalid Status " + data?.status);
        }
    } else if (!data.requestId) {
        throw new Error("requestId is required");
    }
};

const CONNECTION_STATUS = Object.freeze({
    accepted: "accepted",
    rejected: "rejected",
    interested: "interested",
    ignored: "ignored",
});
const POPULATE_USER_FIELDS = [
    "firstName",
    "lastName",
    "imageUrl",
    "age",
    "gender",
];

module.exports = {
    validateSignupInput,
    validateLoginInput,
    validateUpdateProfileData,
    validateConnectionReqData,
    validateConnectionReviewData,
    CONNECTION_STATUS,
    POPULATE_USER_FIELDS,
};
