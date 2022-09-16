const mongoose = require("mongoose");


const patientSchema = mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  birthDate: {type:String, required: true},
  cpf: {type: String, required: true},
  telephone: {type:String, required: true},
  zipcode: {type:String, required: true},
  state: {type:String, required: true},
  city: {type:String, required: true},
  road: {type:String, required: true},
  district: {type:String, required: true},
  houseNumber: {type:Number, required: true},
  appointment: [{type: mongoose.Schema.Types.ObjectId, ref: "Appointment"}]
})


module.exports = mongoose.model("Patient", patientSchema);
