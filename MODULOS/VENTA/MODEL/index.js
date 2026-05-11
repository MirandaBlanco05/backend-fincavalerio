const Venta             = require("./venta.model");
const Cliente           = require("../../CLIENTE/MODEL/cliente.model");
const SecuenciaNcf      = require("../../COMPROBANTE/MODEL/secuencia.model");
const ComprobanteFiscal = require("../../COMPROBANTE/MODEL/comprobante.model");
const MetodoPago        = require("../../METODOPAGO/MODEL/metodo.model");

Cliente.hasMany(Venta,        { foreignKey: "id_cliente", as: "ventas" });
Venta.belongsTo(Cliente,      { foreignKey: "id_cliente", as: "cliente" });

SecuenciaNcf.hasMany(Venta,   { foreignKey: "ncf", as: "ventas" });
Venta.belongsTo(SecuenciaNcf, { foreignKey: "ncf", as: "secuencia" });

Venta.belongsTo(MetodoPago,   { foreignKey: "id_metodo", as: "metodo" });
MetodoPago.hasMany(Venta,     { foreignKey: "id_metodo", as: "ventas" });

console.log("RELACIONES DE VENTA CARGADAS");

module.exports = { Venta, Cliente, SecuenciaNcf, ComprobanteFiscal, MetodoPago };