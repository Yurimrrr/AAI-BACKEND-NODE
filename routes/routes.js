const express = require('express')

//Declaro as rotas da minha aplicação
//Cada const, pega os metodos dos controllers da aplicação.

const {
    getAllCustomer,
    getAddCustomerView,
    addCustomer,
    getUpdateCustomerView,
    updateCustomer,
    getDeleteCustomerView,
    deleteCustomer
} = require('../controllers/customerController')

const {
    getAllBankAccount,
    getAddBankAccountView,
    addBankAccount,
    getBankAccountView,
    // updateBankAccount,
    getDeleteBankAccountView,
    deleteBankAccount
} = require('../controllers/bankAccountController')

const {
    getAllTransactions,
    getAddTransactionView,
    addTransaction,
    getTransactionView,
} = require('../controllers/transactionController')

//Metodo do express que inicializa a rota da aplicação
const router = express.Router();

//declaro o path da rota e o metodo que está atribuido à ele.
router.get('/', getAllCustomer)
router.get('/addCustomer', getAddCustomerView)
router.post('/addCustomer', addCustomer)
router.get('/updateCustomer/:id', getUpdateCustomerView)
router.post('/updateCustomer/:id', updateCustomer)
router.get('/deleteCustomer/:id', getDeleteCustomerView)
router.post('/deleteCustomer/:id', deleteCustomer)
router.get('/getAllBankAccounts', getAllBankAccount)
router.get('/addBankAccount', getAddBankAccountView)
router.post('/addBankAccount', addBankAccount)
router.get('/viewBankAccount/:id', getBankAccountView)
router.get('/deleteBankAccount/:id', getDeleteBankAccountView)
router.post('/deleteBankAccount/:id', deleteBankAccount)
router.get('/getAllTransactions/', getAllTransactions)
router.get('/addTransaction/', getAddTransactionView)
router.post('/addTransaction/', addTransaction)
router.get('/viewTransaction/:id', getTransactionView)

module.exports = {
    routes: router
}