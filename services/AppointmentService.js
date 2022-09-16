const Patients = require("../src/models/Patient");
const Appointments = require("../src/models/Appointment");
const appointmentFactory = require("../factories/appointmentFactory");
const nodemailer = require("nodemailer");


class Appointment {
  async Create(patientName, type, patient, description, date, time) {
    try {
      const Appointment = await Appointments.create({patientName, patient, type, patient, description, date, time});
      const Patient = await Patients.findById(patient);
      Patient.appointment.push(Appointment);
      Patient.save();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async GetAll(showAll) {
    if(showAll) {
      const appos = await Appointments.find({});
      return appos;
    } else {
      const Simpappos = await Appointments.find({finishied: false});
      const appos = [];

      Simpappos.forEach(appo => {
        appos.push(appointmentFactory.Build(appo));
      })

      return appos;
    }
  }

  async GetById(id) {
    try {
      const appo = await Appointments.findById(id);
      if(appo != undefined) {
        return appo;
      } else {
        return false
      }
    } catch (error) {
      console.log(error)
    }

  }

  async GetByPatient(id) {
    try {
      const Simpappos = await Appointments.find({finishied: false, patient: id}).sort({date: 1, time:1});
      const appos = [];

      Simpappos.forEach(appo => {
        appos.push(appointmentFactory.Build(appo));
      })
      return appos;
    } catch (error) {
      console.log(error)
      return false
    }
    
  }

  async PutAppoFinishied(id) {
    try {
      await Appointments.findByIdAndUpdate(id, {finishied: true})
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async PutAppo(id, type, description, date, time) {
    try {
      const appo = await Appointments.findByIdAndUpdate(id, {id, type, description, date, time})
      return true
    } catch (error) {
      console.log(error)
      return false;
    }
  }

  async DeleteAppo(id) {
    try {
      const appo = await Appointments.findByIdAndRemove(id);
      const patient = await Patients.findById(appo.patient);
      const indexAppoRemove = patient.appointment.indexOf(id);
      patient.appointment.splice(indexAppoRemove, 1);
      await patient.save();
      return true
    } catch (error) {
      console.log(error)
      return false;
    }
  }

  async GetFinishied() {
      const Simpappos = await Appointments.find({finishied: true}).sort({date: 1, time:1});
      const appos = [];

      Simpappos.forEach(appo => {
        appos.push(appointmentFactory.Build(appo));
      })

      return appos;
  }

  async SendEmail() {
    const appos = await this.GetAll(false);

    let transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "guilherme09396@hotmail.com", // generated ethereal user
        pass: "matematica9812", // generated ethereal password
      },
    });

    appos.forEach(async appo => {
      const startTime = appo.start;
      const patient = await Patients.findById(appo.patient);
      const hours = startTime.getHours();
      let minutes = startTime.getMinutes();
      if(minutes<10) {
        minutes = `0${minutes}`
      }
      const dateNow = new Date;
      const diff = startTime - dateNow;
      const mili = 60000*60*24;

      if(diff <= mili) {

        if(!appo.notified) {
        
          await Appointments.findByIdAndUpdate(appo.id, {notified: true})
        
        transporter.sendMail({
          from: 'Guilherme Gomes <guilherme09396@hotmail.com>', // sender address
          to: `${patient.email}`, // list of receivers
          subject: "Notificação sobre agendamento de consulta", // Subject line
          html: `Boa tarde Guilherme, tudo bem? :) </br> Estou aqui para ` +
                `te lembrar sobre a sua consulta agendada para amanhã, às ${hours}:${minutes}` +
                `</br></br>Dados do paciente:</br><strong>Nome: ${patient.name}</br> E-mail: ${patient.email}</br> Cpf: ${patient.cpf}</strong> <br><br>` +
                `Dados da consulta: </br><strong>Tipo: ${appo.type}</br> Descrição: ${appo.description}</strong>` +
                `</br></br>Sr(a) ${patient.name}, caso não deseje cancelar ou reagendar sua consulta, entre em contato com o suporte guilherme09396@hotmail.com`, // html body
        }).then((message) => {
          console.log(message)
        }).catch((err) => {
          console.log(err)
        })
        }

      }
    })
  }

}



module.exports = new Appointment();