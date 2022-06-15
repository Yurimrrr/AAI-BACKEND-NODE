//biblioteca que conecta o NodeJs com o mongodb
const mongoose = require('mongoose');
//Logging
const winston = require('winston');

//Inicializo meu documento no mongodb no 0.0.0.0 que é o localhost.
module.exports = () => {
    mongoose.connect('mongodb://0.0.0.0/financeiroDB', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
        useCreateIndex: true
    }).then(() => winston.info("MongoDb connected sucessfuly"))
}