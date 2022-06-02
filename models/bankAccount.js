const mongoose = require("mongoose");
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const bankAccountSchema = new mongoose.Schema({
    number: {
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true
    },
    balance: {
        type: Number,
        required: true
    },
    customerId: { //pesquisar como fazer referenciar objectId de outro documento no mongoose
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
});

const BankAccount = mongoose.model('BankAccount', bankAccountSchema)

const validateBankAccount = (bankAccount) => {
    const schema = {
        number: Joi.string().min(5).max(50).required(),
        balance: Joi.number().required(),
        customerId: Joi.objectId().required(),
    }
    return Joi.validate(bankAccount, schema)
}

module.exports.BankAccount = BankAccount;
module.exports.validate = validateBankAccount;