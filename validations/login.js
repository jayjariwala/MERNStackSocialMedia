const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLogin(data) {
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if(validator.isEmpty(data.email)) {
        errors.email = `Enter your email address`;
    }

    if(validator.isEmpty(data.password)) {
        errors.password = `Enter Password`;
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }

}