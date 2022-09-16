const express = require("express");
const router = express.Router();
const appointmentModel = require("../models/Appointment")
const Patient = require("../../services/PatientService")
const Appointment = require("../../services/AppointmentService");




router.get("/paciente/cadastro", (req, res) => {
  const msg_error = req.flash("msg_error")
  res.render("patients/register", {erros: [], msg_error})
});

//mudar
router.post("/paciente", async (req, res) => {
  const {name, email, birthDate, cpf, telephone, zipcode, state, city, road, district, houseNumber } = req.body;
  const erros = [];

  if(name.length <3) {
    erros.push({name: "Nome muito pequeno, insira novamente"});
  }
  if(cpf.length <14) {
    erros.push({name: "CPF inválido"})
  }
  if(telephone.length <14) {
    erros.push({name: "Telefone curto, insira novamente"})
  }
  if(state.length <3) {
    erros.push({name: "Nome do estado muito pequeno"})
  }
  if(city.length <3) {
    erros.push({name: "Nome da cidade muito pequeno"})
  }
  if(road.length <3) {
    erros.push({name: "Nome da rua muito pequeno"})
  }
  if(district.length <3) {
    erros.push({name: "Nome do bairro muito pequeno"})
  }
  if(houseNumber.length<=0) {
    erros.push({name: "Insira o número da casa"})
  }

  if(erros.length >0) {
    res.render("patients/repeatRegister", {erros, name, email, birthDate, cpf, telephone, zipcode, state, city, road, district, houseNumber})
  } else {
      const patient = await Patient.Create(name, email, birthDate, cpf, telephone, zipcode, state, city, road, district, houseNumber);
      if(patient == true) {
        req.flash("msg_error", "E-mail ou cpf já cadastrados")
        res.redirect("/paciente/cadastro")
      } else if(patient != false) {
        const appointment = false;
        const id = patient._id;
        req.flash("msg_success", "Paciente cadastrado com sucesso!")
        res.redirect(`/paciente/${id}`)
    /*     res.status(201).render("patients/index", {patient: patient, appointment, msg})
    */  }
  }

})

router.get("/paciente/:id", async(req, res) => {
  const patient = await Patient.GetById(req.params.id)
  const appointment = await appointmentModel.find({finishied: false, patient: req.params.id})
  const msg_success = req.flash("msg_success")
  if(appointment.length == 0) {
    const appointment = false
    res.render("patients/index", {patient, appointment, msg_success})
  } else {
    const appos = await Appointment.GetByPatient(req.params.id);
    const appo = appos[0];
    const appointment = true;
    res.render("patients/index", {patient, appointment, appo, msg_success})
  }
})

router.get("/paciente", async (req, res) => {
  //dados do paciente(cadastrar nova consulta, visualizar perfil)
  const patient = await Patient.Get(req.query.id);
  if(patient != false) {
    const appos = await Appointment.GetByPatient(patient[0]._id);
    const appo = appos[0];
    if(appo != undefined) {
      let appointment = true
      res.render("patients/showPatient", {patient, appo, appointment})
    } else {
      appointment = false
      res.render("patients/showPatient", {patient, appointment})
    }
  } else {
    res.render("pages/error", {error: "Paciente não encontrado"})
  }

})

router.get("/paciente/:id/perfil", async (req, res) => {
  const msg_success = req.flash("msg_success");
  const msg_error = req.flash("msg_error");
  const patient = await Patient.GetById(req.params.id);
  const zipcode = patient.zipcode.split("-")[0]
  res.render("patients/profile", {erros: [], patient, msg_error, msg_success})
})

router.get("/paciente/:id/editar", async(req, res) => {
  const patient = await Patient.GetById(req.params.id);
  if(patient != null && patient != false) {
    res.render("patients/editPatient", {erros: [], patient})
  } else {
    console.log(patient)
    res.render("pages/error", {error: "Paciente não encontrado"})
  }
})

router.put("/paciente/:id/editar", async (req, res) => {
  const {name, email, birthDate, cpf, telephone, zipcode, state, city, road, district, houseNumber} = req.body;
  
  const erros = [];

  if(name.length <3) {
    erros.push({name: "Nome muito pequeno, insira novamente"});
  }
  if(cpf.length <14) {
    erros.push({name: "CPF inválido"})
  }
  if(telephone.length <14) {
    erros.push({name: "Telefone curto, insira novamente"})
  }
  if(state.length <3) {
    erros.push({name: "Nome do estado muito pequeno"})
  }
  if(city.length <3) {
    erros.push({name: "Nome da cidade muito pequeno"})
  }
  if(road.length <3) {
    erros.push({name: "Nome da rua muito pequeno"})
  }
  if(district.length <3) {
    erros.push({name: "Nome do bairro muito pequeno"})
  }
  if(houseNumber.length<=0) {
    erros.push({name: "Insira o número da casa"})
  }

  if(erros.length >0) {
    const patient = await Patient.GetById(req.params.id);
    res.render("patients/editPatient", {patient, erros})
  } else {

    const patient = await Patient.PutPatient(req.params.id, name, email, birthDate, cpf, telephone, zipcode, state, city, road, district, houseNumber)

    if(patient) {
      //editou com sucesso!
      req.flash("msg_success", "Dados do paciente editado com sucesso!")
      res.redirect(`/paciente/${req.params.id}/perfil`)
    } else {
      //erro ao editar
      req.flash("msg_error", "Erro ao editar dados do paciente, tente novamente")
      res.redirect(`/paciente/${req.params.id}/perfil`)
    }
  }



})

router.get("/pacientes",async(req, res) => {
  const patients = await Patient.GetAll();
  if(patients != false) {
    res.render("patients/allPatients", {patients})
  }
})

router.get("/pacientes/pesquisa", async(req, res) => {
  const patients = await Patient.GetAll()
  res.render("patients/allPatients", {patients})
})

module.exports = router;