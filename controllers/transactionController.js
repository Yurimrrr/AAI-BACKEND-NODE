const { Transaction, validate } = require('../models/transaction');
const { BankAccount } = require('../models/bankAccount');
const mongoose = require('mongoose');

const getAllTransactions = async(req, res, next) => {
    const list = await Transaction.find().exec()
    const listBankAccounts = await BankAccount.find().exec()

    const listCorreta = getTransactionList(list, listBankAccounts)

    console.log(listCorreta);

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

const getTransactionView = async(req, res, next) => {
    try {
        const id = req.params.id
        const transaction = await Transaction.findById(id).exec()
        const listBankAccounts = await BankAccount.find().exec()

        if (transaction.operation == true) {
            transaction.typeOperation = "Saque"
        } else {
            transaction.typeOperation = "Deposito"
        }

        const listBankAccountCorreta = getBankAccountSelected(listBankAccounts, transaction)

        res.render('viewTransaction', {
            transaction: transaction,
            bankAccounts: listBankAccountCorreta,
            bankActive: false,
            customerActive: false,
            transactionActive: true,
        })
    } catch (error) {
        res.status(400).send(error.message)
    }
}


const getBankAccountSelected = (listBankAccount, transaction) => {
    const listBankAccountCorreta = []

    for (bank of listBankAccount) {
        if (JSON.stringify(transaction.bankAccountId) == JSON.stringify(bank._id)) {
            bank.selected = "selected";
        }
        listBankAccountCorreta.push(bank);
    }

    return listBankAccountCorreta
}

const getTransactionList = (list, listBankAccounts) => {
    const listCorreta = []

    for (transactions of list) {
        // console.log(typeof(transactions.operation))
        if (transactions.operation == true) {
            transactions.typeOperation = "Saque"
        } else {
            transactions.typeOperation = "Deposito"
        }
        for (bank of listBankAccounts) {
            if (JSON.stringify(transactions.bankAccountId) == JSON.stringify(bank._id)) {
                console.log("entrou aq");
                transactions.bank = bank.number;
            }
        }
        listCorreta.push(transactions);
    }

    return listCorreta
}

module.exports = {
    getAllTransactions,
    getAddTransactionView,
    addTransaction,
    getTransactionView
}