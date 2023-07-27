const debug = require('debug')('app:inicio');
//const dbDebug = require('debug')('app:db')
const usuarios = require('./routes/usuarios')
const express = require('express');
const config = require('config');
const morgan = require('morgan');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(express.static('public'));
app.use('api/usuarios', usuarios);

//Configuracion de entorno
console.log('Aplicacion: ' + config.get('nombre'));
console.log('DB server: ' + config.get('configDB.host'));

//Uso de un middleware de un 3ero - Morgan
if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    debug('Morgan esta habilitado');
}

//Trabajos con base de datos
debug('Conectando con la base de datos')

app.get('/',(req, res) => {
    res.send('Hola Mundo desde Express');
});

app.get('/api/usuarios', (req, res) => {
    res.send(usuarios);
})

app.get('/api/usuarios/:id',(req,res) => {
    let usuario = validarUsuario(req.params.id)
    if(!usuario) res.status(404).send('El usuario no fue encontrado');
    res.send(usuario);
})


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`)
})