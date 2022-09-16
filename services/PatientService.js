const Patients = require("../src/models/Patient");
const Appointments = require("../src/models/Appointment");

class Patient {
  async Create(name, email, birthDate, cpf, telephone, zipcode, state, city, road, district, houseNumber) {
    try {

      const patientCpf = await Patients.findOne({cpf: cpf});
      const patientEmail = await Patients.findOne({email: email});

      if(patientCpf == undefined && patientEmail == undefined) {
        const patient = await Patients.create({name, email, birthDate, cpf, telephone, zipcode, state, city, road, district, houseNumber})
        return patient;
      } else {
        return true;
      }

    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async GetById(id) {
    try {
      const patient = await Patients.findById({_id: id});
      return patient;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async Get(id) {
    const patient = await Patients.find({}).or([{cpf: id}, {email: id}]);
    if(patient != undefined) {
      return patient;
    } else {
      return false;
    }
  }

  async GetAll() {
    const patient = await Patients.find({});
    return patient;
  }

  async PutPatient(id,name, email, birthDate, cpf, telephone, zipcode, state, city, road, district, houseNumber) {
    try {
      await Patients.findByIdAndUpdate(id, {name, email, birthDate, cpf, telephone, zipcode, state, city, road, district, houseNumber})
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}


module.exports = new Patient();