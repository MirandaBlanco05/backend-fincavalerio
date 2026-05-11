const Venta             = require("./venta.model");
const Cliente           = require("../../CLIENTE/MODEL/cliente.model");
const SecuenciaNcf      = require("../../COMPROBANTE/MODEL/secuencia.model");
const ComprobanteFiscal = require("../../COMPROBANTE/MODEL/comprobante.model");

Cliente.hasMany(Venta,        { foreignKey: "id_cliente", as: "ventas" });
Venta.belongsTo(Cliente,      { foreignKey: "id_cliente", as: "cliente" });

SecuenciaNcf.hasMany(Venta,   { foreignKey: "ncf", as: "ventas" });
Venta.belongsTo(SecuenciaNcf, { foreignKey: "ncf", as: "secuencia" });

// ComprobanteFiscal.hasMany(SecuenciaNcf, as: "secuencias") ya está definido en COMPROBANTE/MODEL/index.js

console.log("RELACIONES DE VENTA CARGADAS");

module.exports = { Venta, Cliente, SecuenciaNcf, ComprobanteFiscal };