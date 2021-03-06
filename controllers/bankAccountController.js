const { BankAccount, validate } = require('../models/bankAccount');
const { Customer } = require('../models/customer');
const mongoose = require('mongoose');

//Como já diz o nome da função, busco no banco(documento) o resultado da tabela(collection) bankAccount
//"GET"
//@GET(/bankAccountlist)
const getAllBankAccount = async(req, res, next) => {
    //Busca sem paginação dentro do mongo, metodo find encontra todos sem filtro.
    //metodo exec() executa a operação
    const list = await BankAccount.find().exec()
    const listCustomer = await Customer.find().exec()

    //Como o mongodb não tem relacionamento tivemos que fazer alguns ajustes
    //No metodo tenho seu funcionamento.
    const listCorreta = getCustomerNameList(list, listCustomer)

    //Envio as informacoes das variaveis para a tela bankAccountList
    res.render('bankAccountlist', {
        bankAccounts: listCorreta,
        bankActive: true,
        customerActive: false,
        transactionActive: false
    })
}

//Função que retorna de list e renderiza a tela. "GET"
//@GET(/addBankAccount)
const getAddBankAccountView = async(req, res, next) => {
    const listCustomer = await Customer.find().exec()
    res.render('addBankAccount', {
        customers: listCustomer,
        bankActive: true,
        customerActive: false,
        transactionActive: false
    });
}

//Função que recebe a requisição e insere os dados. "POST"
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

//Função que retorna de list e renderiza a tela. "GET"
//@GET(/viewBankAccount)
const getBankAccountView = async(req, res, next) => {
    try {
        const id = req.params.id
        const onebankAccount = await BankAccount.findById(id).exec()
        const listCustomer = await Customer.find().exec()

        const listCustomerCorreta = getCustomerSelected(listCustomer, onebankAccount)

        res.render('viewBankAccount', {
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


//Função que retorna de list e renderiza a tela. "GET"
//@GET(/deleteBankAccount)
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
//Função que recebe a requisição e deleta os dados. "POST"
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

/*Recebe a lista de customers e o banco e procura dentro da lista de customers
* qual é o customer relacionado ào onebankAccount
*/
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

//Solucao pois no EJS, quando eu percorria mais de uma variavel na tela, dava erro.
//No @Get padrao do bankAccount, ele retorna qual é o customer de cada conta na lista.
const getCustomerNameList = (list, listCustomer) => {
    const listCorreta = []

    for (bank of list) {
        for (customer of listCustomer) {
            if (JSON.stringify(bank.customerId) == JSON.stringify(customer._id)) {
                bank.customer = customer.firstname + " " + customer.lastname;
            }
        }
        listCorreta.push(bank);
    }

    return listCorreta
}

//Retorna as funções para o app
module.exports = {
    getAllBankAccount,
    getAddBankAccountView,
    addBankAccount,
    getBankAccountView,
    // updateBankAccount,
    getDeleteBankAccountView,
    deleteBankAccount,
}