//Middleware de retorno de erro quando tem erro de sintaxe ou erro arquitetural. BEM GENERICO !
const winston = require('winston')

module.exports = (err, req, res, next) => {
    winston.error(err.message, err);
    res.status(500).send('Algo está errado!');
}