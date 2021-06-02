const { response } = require("express");
const { Producto } = require("../models");

// obtenerProductos - paginado - total - populate(mongoose)
const obtenerProductos = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [ total, productos ] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .skip(Number(desde))
      .limit(Number(limite))
      .populate('usuario', 'nombre')
      .populate('categoria', 'nombre')
  ])

  res.json({
    total,
    productos
  })
};

// obtenerProducto - populate {}
const obtenerProducto = async (req, res = response) => {
  const { id } = req.params;
  const producto = await Producto.findById(id)
    .populate('usuario', 'nombre')
    .populate('categoria', 'nombre')

  res.json(producto)
};

const crearProducto = async (req, res = response) => {
  const { estado, usuario, ...body } = req.body;

  const productoDB = await Producto.findOne({ nombre: body.nombre });

  if(productoDB) {
    return res.status(400).json({
      msg: `El producto ${productoDB.nombre} ya existe!`
    })
  }

  // Generar la data a guardar
  const data = {
    ...body,
    nombre: body.nombre.toUpperCase(),
    usuario: req.usuario._id,
  }

  const producto = new Producto(data);

  // Guardar DB
  await producto.save();

  res.status(201).json(producto)
};

// actualizarProducto
const actualizarProducto = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuario, __v, ...data } = req.body;

  if(data.nombre) {
    data.nombre = data.nombre.toUpperCase();
  }

  data.usuario = req.usuario._id;

  const producto = await Producto.findByIdAndUpdate(id, data);

  res.json(producto)
};

// borrarProducto - estado:false
const borrarProducto = async (req, res = response) => {
  const { id } = req.params;

  const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });

  res.status(200).json(producto)
};

module.exports = {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  borrarProducto
}