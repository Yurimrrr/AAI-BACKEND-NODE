const mongoose = require("mongoose");
const Joi = require('joi')

const customerSchema = new mongoose.Schema({
    firstname: {
        type: String,
        minlength: 2,
        maxlength: 50,
        required: true
    },
    lastname: {
        type: String,
        minlength: 2,
        maxlength: 50,
        required: true
    },
    phonenumber: {
        type: String,
        minlength: 11,
        required: true
    },
    cpf: {
        type: String,
        minlength: 11,
        required: true
    },
    address: {
        type: String,
        required: true
    }
});

const Customer = mongoose.model('Customer', customerSchema)

const validateCustomer = (customer) => {
    const schema = {
        firstname: Joi.string().min(2).max(50).required(),
        lastname: Joi.string().min(2).max(50).required(),
        phonenumber: Joi.string().min(11).required(),
        cpf: Joi.string().min(11).max(11).required(),
        address: Joi.string().required(),
    }
    return Joi.validate(customer, schema)
}

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;