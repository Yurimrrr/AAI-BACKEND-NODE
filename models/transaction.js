//Crio a minha collection quando for chamada.
const mongoose = require("mongoose");
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const transactionSchema = new mongoose.Schema({
    operation: {
        type: Boolean,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    bankAccountId: { //pesquisar como fazer referenciar objectId de outro documento no mongoose
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BankAccount',
        required: true
    },
});

const Transaction = mongoose.model('Transaction', transactionSchema)

// valido os campos da collection.
const validateTransaction = (transaction) => {
    const schema = {
        operation: Joi.boolean().required(),
        value: Joi.number().required(),
        bankAccountId: Joi.objectId().required(),
    }
    return Joi.validate(transaction, schema)
}

module.exports.Transaction = Transaction;
module.exports.validate = validateTransaction;