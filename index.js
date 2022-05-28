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

require('./startup/db')();
require('./startup/logging')();
require('./startup/validations')();

app.use(expressLayoutes);
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended : true}));
app.use(cors())
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')))

app.use(Routes.routes);
app.use(err);

app.listen(config.port, () => winston.info('App is listening on url http://localhost:' + config.port))
// const port = 3000

// app.get('/', (req, res) => res.send('Hello World!'))
// app.listen(port, () => console.log(`Example app listening on port ${port}!`))