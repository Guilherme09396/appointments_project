const express = require("express");
const router = express.Router();
const appointment = require("../models/Appointment")
const Appointment = require("../../services/AppointmentService");
const Patient = require("../../services/PatientService");


router.get("/consulta/paciente/:id", async (req, res) => {
  const patient = await Patient.GetById(req.params.id);
  if(patient != false) {
      res.render("appointments/register", {patient, erros: []});
  } else {
    res.send("Paciente não existe")
  }
});

router.post("/consulta/paciente/:id", async (req, res) => {
   const patientId = req.params.id;
   const {patientName, type, description, date, time} = req.body;
   const erros = [];

   if(type.length == 0 || type == " ") {
    erros.push("Tipo de consulta inválido")
   }
   if(description.length <5) {
    erros.push("Descrição muito pequena")
   }
   
   if(erros.length >0) {
    const patient = await Patient.GetById(patientId);
    
    if(patient != false) {
      res.render("appointments/register", {patient, erros});
    } else {
      res.render("pages/error", {error: "Erro ao agendar consulta"})
    }

   } else {
    const appo = await Appointment.Create(patientName,type, patientId, description, date, time)

    if(appo) {
      req.flash("msg_success", "Consulta agendada com sucesso!")
      res.redirect("/")
    } else {
      res.render("pages/error", {error: "Erro ao agendar consulta"})
    }
   }


})

router.get("/consultas/calendario", async (req, res) => {
  var appos = await Appointment.GetAll(false);
  res.json(appos)
});

router.get("/consulta/:id", async (req, res) => {
  const appo = await Appointment.GetById(req.params.id);
  if(appo != false) {
    const msg_error = req.flash("msg_error")
    const dateNow = new Date;
    const dateAppo = appo.date;
    dateAppo.setDate(dateAppo.getDate() +1)
    res.render("appointments/showAppo", {appo, dateNow, msg_error})
  } else {
    console.log("consulta não existe")
  }
  
})

router.get("/consulta/:id/finalizar", (req, res) => {
  const appoId = req.params.id;
  res.render("appointments/finishiedAppo", {appoId})
})

router.put("/consulta/:id", async (req, res) => {
  const appo = await Appointment.PutAppoFinishied(req.params.id);
  if(appo) {
    req.flash("msg_success", "Consulta finalizada com sucesso!")
    res.redirect("/")
  } else {
    req.flash("msg_error", "Houve um erro ao finalizar a consulta")
    res.redirect(`/consulta/${req.params.id}`);
  }
})

router.get("/consultas/paciente/:id", async (req, res) => {
  const appos = await Appointment.GetByPatient(req.params.id);
  const patientName = appos[0].patientName;
  const dateNow = new Date;

  if(appos != false) {
    res.render("appointments/showApposFinishied", {appos, patientName, dateNow})
  }

})

router.get("/remarcar/consulta/:id", async (req, res) => {
  const appo = await Appointment.GetById(req.params.id);
  const patient = await Patient.GetById(appo.patient)
  if(appo != false) {
    res.render("appointments/putAppo", {appo, patient});
  }
})

router.put("/remarcar/consulta/:id", async (req, res) => {
  const {type, description, date, time} = req.body;
  const appo = await Appointment.PutAppo(req.params.id, type, description, date, time)

  if(appo) {
    //Atualizou
    req.flash("msg_success", "Consulta remarcada com sucesso!")
    res.redirect("/")
  } else {
    //Deu erro
    req.flash("msg_error", "Houve um erro ao remarcar consulta, tente novamente")
    res.redirect("/")
  }
})

router.get("/consulta/:id/deletar", (req, res) => {
  const appoId = req.params.id;
  res.render("appointments/deleteAppo", {appoId})
})

router.delete("/consulta/:id", async (req, res) => {
  const appo = await Appointment.DeleteAppo(req.params.id);
  if(appo) {
    req.flash("msg_success", "Consulta desmarcada com sucesso!")
    res.redirect("/")
  } else {
    res.render("pages/error", {error: "Houve um erro ao desmarcar consulta"})
  }
})

router.get("/consultas", async (req, res) => {
  const appos = await Appointment.GetFinishied();
  res.render("appointments/allAppos", {appos})
})



module.exports = router;