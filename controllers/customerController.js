const { Customer, validate } = require('../models/customer');

//Como já diz o nome da função, busco no banco(documento) o resultado da tabela(collection) bankAccount
//"GET"
//@GET(/customerlist)
const getAllCustomer = async(req, res, next) => {
    //Busca sem paginação dentro do mongo, metodo find encontra todos sem filtro.
    //metodo exec() executa a operação
    const list = await Customer.find().exec()

    res.render('customerlist', {
        customers: list,
        customerActive: true,
        bankActive: false,
        transactionActive: false
    })
}

//Função que retorna de list e renderiza a tela. "GET"
//@GET(/addCustomer)
const getAddCustomerView = (req, res, next) => {
    res.render('addCustomer', {
        customerActive: true,
        bankActive: false,
        transactionActive: false
    });
}

//Função que recebe a requisição e insere os dados. "POST"
const addCustomer = async(req, res, next) => {
    const { error } = validate(req.body);
    if (error) return res.status(422).send(error.details[0].message);
    const data = req.body
    let customer = await new Customer({
        firstname: data.firstname,
        lastname: data.lastname,
        phonenumber: data.phonenumber,
        cpf: data.cpf,
        address: data.address,
    });
    customer = await customer.save();
    res.redirect('/');
}

//Função que retorna de list e renderiza a tela. "GET"
//@GET(/updateCustomer)
const getUpdateCustomerView = async(req, res, next) => {
    try {
        const id = req.params.id
        const onecustomer = await Customer.findById(id).exec()
        res.render('updateCustomer', {
            customer: onecustomer,
            customerActive: true,
            bankActive: false,
            transactionActive: false
        })
    } catch (error) {
        res.status(400).send(error.message)
    }
}

//Função que recebe a requisição e atualiza os dados. "POST"
const updateCustomer = async(req, res, next) => {
    const { error } = validate(req.body)
    if (error) return res.status(422).send(error.details[0].message);
    const id = req.params.id
    const data = req.body
    let customer = await Customer.findByIdAndUpdate(id, {
        firstname: data.firstname,
        lastname: data.lastname,
        phonenumber: data.phonenumber,
        cpf: data.cpf,
        address: data.address,
    }, { new: true });
    if (!customer) return res.status(404).send('Não foi encontrado nenhum úsuario com o ID da requisição')

    res.redirect('/');
}


//Função que retorna de list e renderiza a tela. "GET"
//@GET(/deleteCustomer)
const getDeleteCustomerView = async(req, res, next) => {
    try {
        const id = req.params.id
        const onecustomer = await Customer.findById(id).exec()
        res.render('deleteCustomer', {
            customer: onecustomer,
            bankActive: true,
            customerActive: false,
            transactionActive: false
        })
    } catch (error) {
        res.status(400).send(error.message)
    }
}

//Função que recebe a requisição e deleta os dados. "POST"
const deleteCustomer = async(req, res, next) => {
    try {
        const id = req.params.id
        const customer = await Customer.findByIdAndRemove(id)

        if (!customer) return res.status(404).send('Não foi encontrado nenhum úsuario com o ID da requisição')
        res.redirect('/')
    } catch (error) {
        res.status(400).send(error.message)
    }
}

module.exports = {
    getAllCustomer,
    getAddCustomerView,
    addCustomer,
    getUpdateCustomerView,
    updateCustomer,
    getDeleteCustomerView,
    deleteCustomer
}