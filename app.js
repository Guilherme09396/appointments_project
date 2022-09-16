const express = require("express");
const app = express();
require("./config/database")
const appointmentRouter = require("./src/routes/appointments");
const path = require("path");
const patientRouter = require("./src/routes/patient");
const Appointment = require("./services/AppointmentService");
const methodOverride = require("method-override");
const flash = require("express-flash");
const session = require("express-session");
const cookie = require("cookie-parser");


//Config
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set("views", path.join(__dirname, "src/views"))
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method", {methods: ["POST", "GET"]}))

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))
app.use(flash());

//Rotas
app.get("/", (req, res) => {
  const msg_success = req.flash("msg_success");
  const msg_error = req.flash("msg_error");
  res.render("index", {msg_success, msg_error})
})
app.use("/", appointmentRouter)
app.use("/", patientRouter)

const mili = 1000*5;

setInterval(async () => {
  await Appointment.SendEmail()
}, mili)


app.listen(4000, () => {
  console.log("Servidor rodando")
})