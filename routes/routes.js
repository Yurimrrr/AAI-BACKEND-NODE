const express = require('express')
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

const router = express.Router();

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
    // router.post('/updateBankAccount/:id', updateBankAccount)
router.get('/deleteBankAccount/:id', getDeleteBankAccountView)
router.post('/deleteBankAccount/:id', deleteBankAccount)
router.get('/getAllTransactions/', getAllTransactions)
router.get('/addTransaction/', getAddTransactionView)
router.post('/addTransaction/', addTransaction)
router.get('/viewTransaction/:id', getTransactionView)
    // addTransaction
module.exports = {
    routes: router
}