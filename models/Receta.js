const mongoose = require('mongoose');
//definir el esquema
const recetaSchema = new mongoose.Schema({
    nombre:String,
    ingredientes:String,
    porciones:Number
});

const RecetaModel = mongoose.model('Receta',recetaSchema,'receta');
module.exports = RecetaModel;
