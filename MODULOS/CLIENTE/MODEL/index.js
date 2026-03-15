const Cliente = require("../MODEL/cliente.model");
const Provincia = require("../MODEL/provincia.model");

// 🔗 CLIENTE ↔ PROVINCIA
Cliente.belongsTo(Provincia, {
  foreignKey: "id_provincia",
  as: "provincia"
});

Provincia.hasMany(Cliente, {
  foreignKey: "id_provincia",
  as: "clientes"
});