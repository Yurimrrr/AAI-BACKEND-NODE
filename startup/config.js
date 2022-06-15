
const dotenv = require('dotenv');
//Modulo de assert global
const assert = require('assert');

//Leio minhas configs do .env
dotenv.config()

const {PORT, HOST, HOST_URL} = process.env;

assert(PORT, 'PORT is required')
assert(HOST, 'HOST is required')

module.exports = {
    port : PORT,
    host: HOST,
    url: HOST_URL
}