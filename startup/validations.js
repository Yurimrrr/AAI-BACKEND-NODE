const Joi = require('joi');

module.exports = () =>{
    Joi.objectId = require('joi-objectId')(Joi)
}