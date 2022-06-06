// const { add } = require('winston');
const { BankAccount, validate } = require('../models/bankAccount');
const { Customer } = require('../models/customer');
const mongoose = require('mongoose');

const getAllBankAccount = async(req, res, next) => {
    const list = await BankAccount.find().exec()
    const listCustomer = await Customer.find().exec()

    const listCorreta = getCustomerNameList(list, listCustomer)

    console.log(listCorreta);
    
    res.render('bankAccountlist', {
        bankAccounts: listCorreta,
        bankActive: true,
        customerActive: false,
        transactionActive: false
    })
}


const getAddBankAccountView = async(req, res, next) => {
    const listCustomer = await Customer.find().exec()
    res.render('addBankAccount', {
        customers: listCustomer,
        bankActive: true,
        customerActive: false
    });
}

const addBankAccount = async(req, res, next) => {
    const { error } = validate(req.body);
    if (error) return res.status(422).send(error.details[0].message);
    const data = req.body

    let bankAccount = await new BankAccount({
        number: data.number,
        balance: data.balance,
        customerId: mongoose.Types.ObjectId(data.customerId)
    });

    bankAccount = await bankAccount.save();

    res.redirect('/getAllBankAccounts');
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
            customerActive: false,
            transactionActive: false
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
            bankActive: true,
            customerActive: false,
            transactionActive: false
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

const getCustomerNameList = (list, listCustomer) => {
    const listCorreta = []

    for (bank of list) {
        for (customer of listCustomer) {
            if (JSON.stringify(bank.customerId) == JSON.stringify(customer._id)) {
                bank.customer = customer.firstname;
            }
        }
        listCorreta.push(bank);
    }

    return listCorreta
}

module.exports = {
    getAllBankAccount,
    getAddBankAccountView,
    addBankAccount,
    getUpdateBankAccountView,
    updateBankAccount,
    getDeleteBankAccountView,
    deleteBankAccount,
}