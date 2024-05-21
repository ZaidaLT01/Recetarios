const mongoose = require('mongoose');
//definir el esquema
const recetaSchema = new mongoose.Schema({
    nombre:String,
    ingredientes:String,
    porciones:Number,
    usuario:{ type:mongoose.Schema.Types.ObjectId,ref: 'Usuario'}
});

const RecetaModel = mongoose.model('Receta',recetaSchema,'receta');
module.exports = RecetaModel;
