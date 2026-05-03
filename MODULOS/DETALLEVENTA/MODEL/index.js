const DetalleVenta = require("./detalle_venta.model");
const MetodoPago   = require("../../METODOPAGO/MODEL/metodo.model");
const { Venta }    = require("../../VENTA/MODEL");
const Producto     = require("../../PRODUCTO/MODEL/producto.model");

Venta.hasMany(DetalleVenta,      { foreignKey: "id_venta",    as: "detalles" });
DetalleVenta.belongsTo(Venta,    { foreignKey: "id_venta",    as: "venta" });

Producto.hasMany(DetalleVenta,   { foreignKey: "id_producto", as: "detalles" });
DetalleVenta.belongsTo(Producto, { foreignKey: "id_producto", as: "producto" });

MetodoPago.hasMany(DetalleVenta,   { foreignKey: "id_metodo", as: "detalles" });
DetalleVenta.belongsTo(MetodoPago, { foreignKey: "id_metodo", as: "metodo" });

console.log("RELACIONES DE DETALLE_VENTA CARGADAS");

module.exports = { DetalleVenta, MetodoPago, Venta, Producto };