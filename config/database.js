const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

mongoose.connect("mongodb+srv://guilherme09396:guilherme9812@cluster0.4k7p4vl.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Conectado ao mongodb")
}).catch((err) => {
  console.log(`Houve um erro ao se conectar: ${err}`)
})