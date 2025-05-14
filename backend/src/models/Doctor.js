/*
nombre
especialidad
correo
contraseña
 */

import { Schema } from "mongoose";
import { model } from "mongoose";

const DoctorSchema = new Schema({
    name:{
        type: String,
        require: true
    },
    specialty: {
        type: String,
        required: true
      },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
      },
 }, 
 {
    collection: 'Doctors'
  },
    {
      timestamps: true,
      strict: false 
    }
);
    
    export default model('Doctor', DoctorSchema);