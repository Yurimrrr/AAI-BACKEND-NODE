const { Transaction, validate } = require('../models/transaction');
const { BankAccount } = require('../models/bankAccount');
const mongoose = require('mongoose');

const getAllTransactions = async(req, res, next) => {
    const list = await Transaction.find().exec()
    const listBankAccounts = await BankAccount.find().exec()

    const listCorreta = getTransactionList(list, listBankAccounts)

    res.render('transactionlist', {
        transactions: listCorreta,
        bankActive: false,
        customerActive: false,
        transactionActive: true,
        resposta: "",
        tipo_resposta: ""
    })
}


const getAddTransactionView = async(req, res, next) => {
    const listBankAccount = await BankAccount.find().exec()
    res.render('addTransaction', {
        bankAccounts: listBankAccount,
        bankActive: false,
        customerActive: false,
        transactionActive: true,
        resposta: "",
        tipo_resposta: ""
    });
}

const addTransaction = async(req, res, next) => {
    const { error } = validate(req.body);
    if (error) return res.status(422).send(error.details[0].message);
    const data = req.body

    const bankId = mongoose.Types.ObjectId(data.bankAccountId)

    const bankAccount = await BankAccount.findById(bankId).exec()

    //True = saque
    if(data.operation == "true"){
        if(bankAccount.balance == 0){
            const listBankAccount = await BankAccount.find().exec()
            res.render('addTransaction', {
                bankAccounts: listBankAccount,
                bankActive: false,
                customerActive: false,
                transactionActive: true,
                resposta: `Não pode efetuar um saque para a conta ${bankAccount.number} pois não possui saldo!` ,
                tipo_resposta: "danger"
            });
        }else if(bankAccount.balance < data.value){
            const listBankAccount = await BankAccount.find().exec()
            res.render('addTransaction', {
                bankAccounts: listBankAccount,
                bankActive: false,
                customerActive: false,
                transactionActive: true,
                resposta: `Não pode efetuar um saque para a conta ${bankAccount.number} pois o valor de saque é maior que o saldo!` ,
                tipo_resposta: "danger"
            });
        }else{
            updateBalance(bankAccount, "-", data)

            let transaction = await new Transaction({
                operation: data.operation,
                value: data.value,
                bankAccountId: mongoose.Types.ObjectId(data.bankAccountId)
            });
    
            transaction = await transaction.save();
    
            res.redirect('/getAllTransactions');
        }
    }else{
        updateBalance(bankAccount, "+", data)
        
        let transaction = await new Transaction({
            operation: data.operation,
            value: data.value,
            bankAccountId: mongoose.Types.ObjectId(data.bankAccountId)
        });

        transaction = await transaction.save();

        res.redirect('/getAllTransactions');
    }
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
        if (transactions.operation == true) {
            transactions.typeOperation = "Saque"
        } else {
            transactions.typeOperation = "Deposito"
        }
        for (bank of listBankAccounts) {
            if (JSON.stringify(transactions.bankAccountId) == JSON.stringify(bank._id)) {
                transactions.bank = bank.number;
            }
        }
        listCorreta.push(transactions);
    }

    return listCorreta
}

const updateBalance = async(bank, operation, data) => {

    let valor
    console.log("teste1")
    if(operation == "+"){
        console.log("teste2")
        console.log(bank._id);
        valor = bank.balance + parseInt(data.value)
    }else{
        console.log("teste3")
        console.log(bank._id);
        valor = bank.balance - parseInt(data.value)
    }
    
    let bankAccount = await BankAccount.findByIdAndUpdate(bank._id, {
        balance: valor,
    }, { new: true });
    if (!bankAccount) return res.status(404).send('Não foi encontrado nenhum banco com o ID da requisição')
}

module.exports = {
    getAllTransactions,
    getAddTransactionView,
    addTransaction,
    getTransactionView
}