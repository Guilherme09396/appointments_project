const Patient = require("../src/models/Patient");
const PatientService  = require("../services/PatientService");

class appointmentFactory {
    Build(simpleappo) {
    const year = simpleappo.date.getFullYear();
    const month = simpleappo.date.getMonth();
    const day = simpleappo.date.getDate()+1;
    const hour = simpleappo.time.split(":")[0];
    const minutes = simpleappo.time.split(":")[1];
    

    const newDate = new Date(year, month, day, hour, minutes,0,0);

    var appo = {
      id: simpleappo._id, 
      title: simpleappo.patientName + " - " + simpleappo.type,
      start: newDate,
      end: newDate,
      day: newDate.getDate(),
      month: newDate.getMonth()+1,
      minutes: minutes,
      type: simpleappo.type,
      description: simpleappo.description,
      patientName: simpleappo.patientName,
      patient: simpleappo.patient,
      notified: simpleappo.notified
    }
    return appo;
  }
}

module.exports = new appointmentFactory();