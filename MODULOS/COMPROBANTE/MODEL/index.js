const ComprobanteFiscal = require("./comprobante.model");
const SecuenciaNcf      = require("./secuencia.model");

ComprobanteFiscal.hasMany(SecuenciaNcf, { foreignKey: "id_comprobante", as: "secuencias" });
SecuenciaNcf.belongsTo(ComprobanteFiscal, { foreignKey: "id_comprobante", as: "comprobante" });

console.log("RELACIONES DE COMPROBANTE CARGADAS");

module.exports = { ComprobanteFiscal, SecuenciaNcf };