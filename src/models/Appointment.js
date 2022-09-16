const mongoose = require("mongoose");


const appointmentSchema = mongoose.Schema({
  patient: {type: mongoose.Schema.Types.ObjectId, ref:"Patient", required: true},
  patientName: {type: String, required: true},
  type: {type: String, required: true},
  description: {type: String, required: true},
  date: {type: Date, required: true},
  time: {type: String, required: true},
  finishied: {type: Boolean, default: false},
  notified: {type: Boolean, default: false}
})


module.exports = mongoose.model("Appointment", appointmentSchema);