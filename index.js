
//Importo as bibliotecas npm utilizadas no projeto e que instalo elas à partir do npm i
const express = require('express')
const cors = require('cors')
const path = require('path')
const expressLayoutes = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const config = require('./startup/config')
const winston = require('winston')
const err = require('./middleware/errors')
const Routes = require('./routes/routes')
const app = express()

//Chamo os arquivos de startup para funcionamento do projeto
require('./startup/db')();
require('./startup/logging')();
require('./startup/validations')();

//Faço a aplicacao utilizar ejs
app.use(expressLayoutes);
app.set('view engine', 'ejs');

//inicializo bibliotecas express e bodyParser para receber as requisicoes HTTPS.
app.use(express.urlencoded({extended : true}));
app.use(cors())
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')))

//Uso minhas rotas inicializadas no routes.js
app.use(Routes.routes);
app.use(err);

//Inicializo o projeto na porta e mando uma info no console que o projeto roda no localhost na porta definida no .env
app.listen(config.port, () => winston.info('App is listening on url http://localhost:' + config.port))
