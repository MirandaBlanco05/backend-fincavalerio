const CompraProveedor   = require("./compra.model");
const { Proveedor }         = require("../../PROVEEDOR/MODEL");
const { SecuenciaNcf, ComprobanteFiscal }      = require("../../COMPROBANTE/MODEL");

Proveedor.hasMany(CompraProveedor,      { foreignKey: "id_proveedor", as: "compras" });
CompraProveedor.belongsTo(Proveedor,    { foreignKey: "id_proveedor", as: "proveedor" });

SecuenciaNcf.hasMany(CompraProveedor,   { foreignKey: "ncf", as: "compras" });
CompraProveedor.belongsTo(SecuenciaNcf, { foreignKey: "ncf", as: "secuencia" });

console.log("RELACIONES DE COMPRA CARGADAS");

module.exports = { CompraProveedor, Proveedor, SecuenciaNcf, ComprobanteFiscal };