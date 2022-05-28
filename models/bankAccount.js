const mongoose = require("mongoose");
const Joi = require('joi')
// const Costumer = require("./costumer")

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
    user: { //pesquisar como fazer referenciar objectId de outro documento no mongoose
        type: Number,
        required: true
    },
});

const BankAccount = mongoose.model('BankAccount', bankAccountSchema)

const validateBankAccount = (bankAccount) => {
    const schema = {
        number: Joi.string().min(5).max(50).required(),
        balance: Joi.number().required(),
        user: Joi.number().required(),
    }
    return Joi.validate(bankAccount, schema)
}

module.exports.BankAccount = BankAccount;
module.exports.validate = validateBankAccount;