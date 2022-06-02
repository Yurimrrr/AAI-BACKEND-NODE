const { Customer, validate } = require('../models/customer');

const getAllCustomer = async(req, res, next) => {
    const list = await Customer.find().exec()

    res.render('customerlist', {
        customers: list,
        customerActive: true,
        bankActive: false,
        transactionActive: false
    })
}

const getAddCustomerView = (req, res, next) => {
    res.render('addCustomer', {
        customerActive: true,
        bankActive: false,
        transactionActive: false
    });
}

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