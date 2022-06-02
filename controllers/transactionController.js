// const { add } = require('winston');
const { Transaction, validate } = require('../models/transaction');
const { BankAccount } = require('../models/bankAccount');
const mongoose = require('mongoose');

const getAllTransactions = async(req, res, next) => {
    const list = await Transaction.find().exec()
    const listBankAccounts = await BankAccount.find().exec()

    const listCorreta = getBankAccountList(list, listBankAccounts)

    res.render('transactionlist', {
        transactions: listCorreta,
        bankActive: false,
        customerActive: false,
        transactionActive: true,
    })
}


const getAddTransactionView = async(req, res, next) => {
    const listBankAccount = await BankAccount.find().exec()
    res.render('addTransaction', {
        bankAccounts: listBankAccount,
        bankActive: false,
        customerActive: false,
        transactionActive: true,
    });
}

const addTransaction = async(req, res, next) => {
    const { error } = validate(req.body);
    if (error) return res.status(422).send(error.details[0].message);
    const data = req.body

    let transaction = await new Transaction({
        operation: data.operation,
        value: data.value,
        bankAccountId: mongoose.Types.ObjectId(data.bankAccountId)
    });

    transaction = await transaction.save();

    res.redirect('/getAllTransactions');
}

const getUpdateBankAccountView = async(req, res, next) => {
    try {
        const id = req.params.id
        const onebankAccount = await BankAccount.findById(id).exec()
        const listCustomer = await Customer.find().exec()

        const listCustomerCorreta = getCustomerSelected(listCustomer, onebankAccount)

        res.render('updateBankAccount', {
            bankAccount: onebankAccount,
            customers: listCustomerCorreta,
            bankActive: true,
            customerActive: false
        })
    } catch (error) {
        res.status(400).send(error.message)
    }
}

const updateBankAccount = async(req, res, next) => {
    const { error } = validate(req.body)
    if (error) return res.status(422).send(error.details[0].message);
    const id = req.params.id
    const data = req.body
    let bankAccount = await BankAccount.findByIdAndUpdate(id, {
        number: data.number,
        balance: data.balance,
        customerId: mongoose.Types.ObjectId(data.customerId)
    }, { new: true });
    if (!bankAccount) return res.status(404).send('Não foi encontrado nenhum úsuario com o ID da requisição')

    res.redirect('/getAllBankAccounts');
}

const getDeleteBankAccountView = async(req, res, next) => {
    try {
        const id = req.params.id
        const onebankAccount = await BankAccount.findById(id).exec()
        const listCustomer = await Customer.find().exec()

        for (customer of listCustomer) {
            if (JSON.stringify(onebankAccount.customerId) == JSON.stringify(customer._id)) {
                onebankAccount.customer = customer.firstname + " " + customer.lastname;
            }
        }

        res.render('deleteBankAccount', {
            bankAccount: onebankAccount,
            bankActive: false,
            customerActive: false,
            transactionActive: true,
        })
    } catch (error) {
        res.status(400).send(error.message)
    }
}

const deleteBankAccount = async(req, res, next) => {
    try {
        const id = req.params.id
        const bankAccount = await BankAccount.findByIdAndRemove(id)

        if (!bankAccount) return res.status(404).send('Não foi encontrado nenhuma conta com o ID da requisição')
        res.redirect('/getAllBankAccounts')
    } catch (error) {
        res.status(400).send(error.message)
    }
}

const getCustomerSelected = (listCustomer, onebankAccount) => {
    const listCustomerCorreta = []

    for (customer of listCustomer) {
        if (JSON.stringify(onebankAccount.customerId) == JSON.stringify(customer._id)) {
            customer.selected = "selected";
        }
        listCustomerCorreta.push(customer);
    }

    return listCustomerCorreta
}

const getBankAccountList = (list, listBankAccounts) => {
    const listCorreta = []

    for (transactions of list) {
        if (transactions.operation) {
            transactions.operation = "Saque"
        } else {
            transactions.operation = "Deposito"
        }
        for (bank of listBankAccounts) {
            if (JSON.stringify(transactions.bankAccountId) == JSON.stringify(bank._id)) {
                console.log("entrou aq");
                transactions.bank = bank.number;
            }
        }
        listCorreta.push(bank);
    }

    return listCorreta
}

module.exports = {
    getAllTransactions,
    getAddTransactionView,
    addTransaction,
    getUpdateBankAccountView,
    updateBankAccount,
    getDeleteBankAccountView,
    deleteBankAccount,
}