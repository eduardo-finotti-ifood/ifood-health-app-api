// CONFIGURAÇÃO BÁSICA
// ======================================

// IMPORTANDO OS PACKAGES --------------------
const express = require('express') // importando o express
const app = express() // definindo nosso app para usar o express
const bodyParser = require('body-parser') // importando body-parser
const morgan = require('morgan') // vamos usar para logar as requests
const port = process.env.PORT || 8000 // configurando a porta do serviço

var admin = require("firebase-admin");
var serviceAccount = require("./auth/ifood.json");
const fs = require('fs');

// CONFIGURANDO O SERVIÇO ---------------------
// usando o parser para pegar a informação do POST
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// configurando as chamadas CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization')
    next()
})

// logando as requisições no console
app.use(morgan('dev'))

// pegando uma instância do express router
const router = express.Router()

var db = null;
var searchRef = null;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ifood-ab004-2ed2b.firebaseio.com/"
});
  
db = admin.database();
searchRef = db.ref()

router.use(function (req, res, next) {
    next() 
})

router.route('/health')
    .get(async function (req, res) {      
        
    let f = [];

    await searchRef.child("failures-controller").on('value', async function(snapshot){

        await snapshot.forEach(feature => {
            f.push(feature.val());
        });
        
    })

    res.status(200).json({result: f})
})

module.exports = app
app.use('/api', router)
app.listen(port)
exports = module.exports = app;