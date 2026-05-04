const DetalleCompra   = require("./detallecompra.model");
const MetodoPago      = require("../../METODOPAGO/MODEL/metodo.model");
const { CompraProveedor } = require("../../COMPRA/MODEL");  // ← destructuring
const Insumo          = require("../../INSUMO/MODEL/insumo.model");
const Empleado        = require("../../EMPLEADO/MODEL/empleado.model");

MetodoPago.hasMany(DetalleCompra,        { foreignKey: "id_metodo",   as: "detalles_compra" });
DetalleCompra.belongsTo(MetodoPago,      { foreignKey: "id_metodo",   as: "metodo" });

CompraProveedor.hasMany(DetalleCompra,   { foreignKey: "id_compra",   as: "detalles" });
DetalleCompra.belongsTo(CompraProveedor, { foreignKey: "id_compra",   as: "compra" });

Insumo.hasMany(DetalleCompra,            { foreignKey: "id_insumo",   as: "detalles_compra" });
DetalleCompra.belongsTo(Insumo,          { foreignKey: "id_insumo",   as: "insumo" });

Empleado.hasMany(DetalleCompra,          { foreignKey: "id_empleado", as: "detalles_compra_emp" });
DetalleCompra.belongsTo(Empleado,        { foreignKey: "id_empleado", as: "empleado" });

console.log("RELACIONES DE DETALLE_COMPRA CARGADAS");

module.exports = { DetalleCompra, MetodoPago };