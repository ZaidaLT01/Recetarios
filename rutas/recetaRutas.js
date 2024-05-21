const express = require('express');
const rutas = express.Router();
const RecetaModel = require('../models/Receta');
const UsuarioModel = require('../models/Usuario');

//endpoint para traer todas las recetas
rutas.get('/traerRecetas',async(req,res)=>{
    try{
        const receta= await RecetaModel.find();
        res.json(receta);
    }catch(error){
        res.status(500).json({mensaje:error.message});
    }
});
module.exports=rutas;
//endpoint 2 Crear
rutas.post('/crear',async(req,res)=>{
    const receta=new RecetaModel({
        nombre: req.body.nombre,
        ingredientes: req.body.ingredientes,
        porciones: req.body.porciones,
        usuario:req.body.usuario //asignar el id del usuario

        /*debido a que ingresamos sesion solo se guarda el ususario del que inicio sesion, a menos que se cambie la autenticacion, o token con el que queramos ingresas a la funcion crear
        debido a eso en este metodo se puede crear utilizando el id del cuerpo de postman dado, este anterior sirve mucho para lo que es controles de administracion o solo gerente y demas
        usuario:req.usuario._id */
    })
    console.log(receta);
    try{
        const nuevaReceta= await receta.save();
        res.status(201).json(nuevaReceta);
    }catch(error){
        res.status(500).json({mensaje:error.message});
    }
});
//endpoint 3 Editar
rutas.put('/editar/:id',async(req,res)=>{

    try{
        const recetaEditada= await RecetaModel.findByIdAndUpdate(req.params.id, req.body, {new :true});
        if(!recetaEditada)
            return res.status(404).json({mensaje:"Receta no Encontrada"});
        else
            return res.status(201).json(recetaEditada);
    }catch(error){
        res.status(500).json({mensaje:error.message});
    }
});
//endpoint 4 Eliminar
rutas.delete('/eliminar/:id',async(req,res)=>{

    try{
        const recetaEliminada = await RecetaModel.findByIdAndDelete(req.params.id) ;
        if(!recetaEliminada)
            return res.status(404).json({mensaje:"Receta no Encontrada"});
        else
            return res.json({mensaje: 'Receta Eliminada'});
    }catch(error){
        res.status(500).json({mensaje:error.message});
    }
});

//endpoint 5- obtener una receta por su ID
rutas.get('/recetaObt/:id', async (req, res) => {
    try {
        const receta = await RecetaModel.findById(req.params.id);
        if (!receta)
            return res.status(404).json({ mensaje : 'Receta no encontrada!!!'});
        else 
            return res.json(receta);
    } catch(error) {
        res.status(500).json({ mensaje :  error.message})
    }
});
//- obtener recetas por un ingrediente especifico
rutas.get('/recetaPorIngrediente/:ingrediente', async (req, res) => {
    try {
        const recetaIngrediente = await RecetaModel.find({ ingredientes: new RegExp(req.params.ingrediente, 'i')});
        return res.json(recetaIngrediente);
    } catch(error) {
        res.status(500).json({ mensaje :  error.message})
    }
});

//- eliminar todas las recetas
rutas.delete('/eliminarTodos', async (req, res) => {
    try {
        await RecetaModel.deleteMany({ });
        return res.json({mensaje: "Todas las recetas han sido eliminadas"});
    } catch(error) {
        res.status(500).json({ mensaje :  error.message})
    }
});

//- contar el numero total de recetas
rutas.get('/totalRecetas', async (req, res) => {
    try {
        const total = await RecetaModel.countDocuments();
        return res.json({totalReceta: total });
    } catch(error) {
        res.status(500).json({ mensaje :  error.message})
    }
});


//- obtener recetas ordenadas por nombre ascendente
// query.sort({ field: 'asc', test: -1 });
rutas.get('/ordenarRecetas', async (req, res) => {
    try {
       const recetasOrdenadas = await RecetaModel.find().sort({ nombre: 1});
       res.status(200).json(recetasOrdenadas);
    } catch(error) {
        res.status(500).json({ mensaje :  error.message})
    }
});
//- obtener receta por cantidad
rutas.get('/recetaPorCantidad/:cantidad', async (req, res) => {
    try {
       const recetas = await RecetaModel.find({ porciones : req.params.cantidad});
       res.status(200).json(recetas);
    } catch(error) {
        res.status(500).json({ mensaje :  error.message})
    }
});

/*endpoint 6 - obtener recetas por un ingrediente especifico (este solo reconoce ingrediente tal y como esta, no se puede buscar solo por un ingrediente cono "leche")
rutas.get('/norbertoQuispe/:ingrediente', async (req, res) => {
try {
        console.log(req.params.ingrediente);
        const recetaIngrediente = await RecetaModel.find({ ingredentes: req.params.ingrediente});
        console.log(recetaIngrediente);

        return res.json(recetaIngrediente);
    } catch(error) {
        res.status(500).json({ mensaje :  error.message})
    }
});*/


//REPORTES 1
rutas.get('/recetaPorUsuario/:usuarioid', async (peticion, res) =>{
    const {usuarioid} = peticion.params;
    try{
        const usuario = await UsuarioModel.findById(usuarioid);
        if(!usuario)
            return res.status(404).json({mensaje: 'usuario no encontrado'});
        const recetas = await RecetaModel.find({usuario:usuarioid}).populate('usuario');
        res.json(recetas);

    }catch(error){
        res.status(500).json({ mensaje :  error.message})
    }
});

module.exports=rutas;