const {BankAccount, validate} = require('../models/bankAccount');

const getAllBankAccount = async(req, res, next) => {
    const list = await BankAccount.find().exec()

    res.render('bankAccountlist', {
        bankAccounts: list
    }) 
}

const getAddBankAccountView = (req, res, next) => {
    res.render('addBankAccount');
}

const addBankAccount = async (req, res, next) => {
    const {error} = validate(req.body);
    if(error) return res.status(422).send(error.details[0].message);
    const data = req.body
    let BankAccount = await new BankAccount({
        number: data.number,
        balance: data.balance,
        user: data.user
    });
    BankAccount = await BankAccount.save();
    res.redirect('/getAllBankAccounts');
}

const getUpdateBankAccountView = async (req, res, next) => {
    try{
        const id = req.params.id
        const onebankAccount = await BankAccount.findById(id).exec()
        res.render('updateBankAccount',{
            BankAccount: onebankAccount
        })
    }catch(error){
        res.status(400).send(error.message)
    }
}

const updateBankAccount = async(req, res, next) => {
    const {error} = validate(req.body)
    if(error) return res.status(422).send(error.details[0].message);
    const id = req.params.id
    const data = req.body
    let BankAccount = await BankAccount.findByIdAndUpdate(id, {
        // firstname: data.firstname,
        // lastname: data.lastname,
        // phonenumber: data.phonenumber,
        // cpf: data.cpf,
        // address: data.address,
    }, {new: true});
    if(!BankAccount) return res.status(404).send('Não foi encontrado nenhum úsuario com o ID da requisição')

    res.redirect('/');
}

const getDeleteBankAccountView = async (req, res, next) => {
    try{
        const id = req.params.id
        const onebankAccount = await BankAccount.findById(id).exec()
        res.render('deleteBankAccount',{
            BankAccount: onebankAccount
        })
    }catch(error){
        res.status(400).send(error.message)
    }
}

const deleteBankAccount = async (req, res, next) => {
    try{
        const id = req.params.id
        const BankAccount = await BankAccount.findByIdAndRemove(id)

        if(!BankAccount) return res.status(404).send('Não foi encontrado nenhum úsuario com o ID da requisição')
        res.redirect('/')
    }catch(error){
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
    deleteBankAccount
}