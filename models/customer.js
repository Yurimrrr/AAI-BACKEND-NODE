//Crio a minha collection quando for chamada.
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

// valido os campos da collection.
const validateCustomer = (customer) => {
    const schema = {
        firstname: Joi.string().trim().min(2).max(50).required(),
        lastname: Joi.string().trim().min(2).max(50).required(),
        phonenumber: Joi.string().trim().min(11).max(11).required(),
        cpf: Joi.string().trim().min(11).max(11).required(),
        address: Joi.string().trim().required(),
    }
    return Joi.validate(customer, schema)
}

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;