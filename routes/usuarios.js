const express = require('express');
const ruta = express.Router();
const Joi = require('@hapi/joi');

const usuarios = [
    {id:1, nombre:'Grover'},
    {id:2, nombre:'Pablo'},
    {id:3, nombre:'German'},
]

ruta.post('/', (req,res) => {
    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });
    const {error, value} = validarUsuario(req.body.nombre)
    if(!error){
        const usuario = {
            id: usuarios.length + 1,
            nombre: value.nombre,
        };
        usuarios.push(usuario);
        res.send(usuarios);
    }else{
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
    }
});

ruta.put('/:id', (req,res) => {
    let usuario = existeUsuario(req.params.id);
    if(!usuario){
        res.status(404).send('El usuario no fue encontrado');
        return;
    }

    const {error, value} = validarUsuario(req.body.nombre)

    if(error){
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
        return;
    }
    usuario.nombre = value.nombre;
    res.send(usuario)
})

ruta.delete('/:id', (req,res) => {
    let usuario = existeUsuario(req.params.id);
    if(!usuario){
        res.status(404).send('El usuario no fue encontrado');
        return;
    }
    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);
    res.send(usuarios)
})

function existeUsuario(id){
    return (usuarios.find(u => u.id === parseInt(id)))
}

function validarUsuario(nom){
    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });
    return (schema.validate({nombre: nom}))
}

module.exports = ruta;