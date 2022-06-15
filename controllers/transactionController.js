const { Transaction, validate } = require('../models/transaction');
const { BankAccount } = require('../models/bankAccount');
const mongoose = require('mongoose');


//Como já diz o nome da função, busco no banco(documento) o resultado da tabela(collection) bankAccount
//"GET"
//@GET(/transactionlist)
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

//Função que retorna de list e renderiza a tela. "GET"
//@GET(/addCustomer)
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

//Função que recebe a requisição e insere os dados. "POST"
const addTransaction = async(req, res, next) => {
    const { error } = validate(req.body);
    if (error) return res.status(422).send(error.details[0].message);
    const data = req.body

    data.value.split(',')

    const bankId = mongoose.Types.ObjectId(data.bankAccountId)

    const bankAccount = await BankAccount.findById(bankId).exec()

    //True = saque
    //Validações de regra de negocio,
    //Operacao True é saque
    /*
    *Quando a operação for de saque, não se pode ter um saldo = 0 nem saldo < que o valor que quer sacar
    *Quando for operação de deposito, pode operar em qualquer situação.
    */
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

//Função que retorna de list e renderiza a tela. "GET"
//@GET(/viewTransaction)
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

//Encontra o banco relacionado à transacao
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

//Troca saque e deposito de boolean para string e tras o bankAccount.number
//dentro da lista de transactions
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

//Funcao de atualizar o balance de uma conta.
const updateBalance = async(bank, operation, data) => {

    let valor
    if(operation == "+"){
        console.log(bank._id);
        valor = bank.balance + parseInt(data.value)
    }else{
        console.log(bank._id);
        valor = bank.balance - parseInt(data.value)
    }
    
    //Encontra a conta pelo bank._id enviado por parametro e atualiza o balance
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