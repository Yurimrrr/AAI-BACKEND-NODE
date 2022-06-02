// const { add } = require('winston');
const { BankAccount, validate } = require('../models/bankAccount');
const { Customer } = require('../models/customer');
const mongoose = require('mongoose');

const getAllBankAccount = async(req, res, next) => {
    const list = await BankAccount.find().exec()
    const listCustomer = await Customer.find().exec()

    const listCorreta = []

    // console.log(list);

    for (bank of list) {
        for (customer of listCustomer) {
            console.log(JSON.stringify(bank.customerId))
            console.log(JSON.stringify(customer._id))
            if (JSON.stringify(bank.customerId) == JSON.stringify(customer._id)) {
                bank.customer = customer.firstname;
            }
        }
        listCorreta.push(bank);
    }

    console.log(listCorreta);

    res.render('bankAccountlist', {
        bankAccounts: listCorreta
    })
}


const getAddBankAccountView = async(req, res, next) => {
    const listCustomer = await Customer.find().exec()
    res.render('addBankAccount', {
        customers: listCustomer
    });
}

const addBankAccount = async(req, res, next) => {
    const { error } = validate(req.body);
    if (error) return res.status(422).send(error.details[0].message);
    const data = req.body

    let idcustomer = mongoose.Types.ObjectId(data.customer);

    let bankAccount = await new BankAccount({
        number: data.number,
        balance: data.balance,
        customerId: mongoose.Types.ObjectId(data.customerId)
    });
    console.log(await bankAccount.save());

    // bankAccount = await bankAccount.save();

    res.redirect('/getAllBankAccounts');
}

const getUpdateBankAccountView = async(req, res, next) => {
    try {
        const id = req.params.id
        const onebankAccount = await BankAccount.findById(id).exec()
        res.render('updateBankAccount', {
            BankAccount: onebankAccount
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
    let BankAccount = await BankAccount.findByIdAndUpdate(id, {
        // firstname: data.firstname,
        // lastname: data.lastname,
        // phonenumber: data.phonenumber,
        // cpf: data.cpf,
        // address: data.address,
    }, { new: true });
    if (!BankAccount) return res.status(404).send('Não foi encontrado nenhum úsuario com o ID da requisição')

    res.redirect('/');
}

const getDeleteBankAccountView = async(req, res, next) => {
    try {
        const id = req.params.id
        const onebankAccount = await BankAccount.findById(id).exec()
        res.render('deleteBankAccount', {
            BankAccount: onebankAccount
        })
    } catch (error) {
        res.status(400).send(error.message)
    }
}

const deleteBankAccount = async(req, res, next) => {
    try {
        const id = req.params.id
        const BankAccount = await BankAccount.findByIdAndRemove(id)

        if (!BankAccount) return res.status(404).send('Não foi encontrado nenhum úsuario com o ID da requisição')
        res.redirect('/')
    } catch (error) {
        res.status(400).send(error.message)
    }
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