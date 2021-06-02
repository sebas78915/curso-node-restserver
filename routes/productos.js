const { Router } = require('express');
const { check } = require('express-validator');
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const router = Router();

// Obtener todas las categorías - público
router.get('/', obtenerProductos);

// Obtener una categoría por id - público
router.get('/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existeProductoPorId),
  validarCampos
], obtenerProducto);

// Crear categoría - privado - cualquier persona con un token válido
router.post('/', [
  validarJWT,
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('categoria', 'No es un ID válido').isMongoId(),
  check('categoria').custom(existeCategoriaPorId),
  validarCampos
], crearProducto);

// Actualizar un registro por id - privado - cualquier persona con un token válido
router.put('/:id', [
  validarJWT,
  check('id').custom(existeProductoPorId),
  validarCampos
], actualizarProducto);

// Borrar una categoría - Admin
router.delete('/:id', [
  validarJWT,
  esAdminRole,
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existeProductoPorId),
  validarCampos
], borrarProducto);

module.exports = router;