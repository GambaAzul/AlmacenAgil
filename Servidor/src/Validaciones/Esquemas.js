import { z } from 'zod'

const LimiteStock=1000
const Texto = (minimo,maximo) => z.string().trim().min(minimo).max(maximo)
const Correo = z.string().trim().email().max(160).transform(valor=>valor.toLowerCase())
const Dni = z.string().regex(/^\d{8}$/)
const Ruc = z.string().regex(/^\d{11}$/)
const Telefono = z.string().regex(/^\+?\d{7,15}$/)
const TelefonoCelular = z.string().regex(/^9\d{8}$/)
const CorreoCotizacion = z.string().max(46)
  .refine(valor=>{
    const partes=valor.split('@')
    if (partes.length!==2) return false
    const [local,dominio]=partes
    return /^[A-Za-z0-9.]{6,30}$/.test(local)&&/^[A-Za-z0-9]+(\.[A-Za-z0-9]+)+$/.test(dominio)&&dominio.length<=15
  },{message:'Correo inválido'})
  .transform(valor=>valor.toLowerCase())
const Entero = z.coerce.number().finite().int().min(0).max(1000000)
const Stock = z.coerce.number().finite().int().min(0).max(LimiteStock)
const CantidadStock = z.coerce.number().finite().int().min(1).max(LimiteStock)
const Dinero = z.coerce.number().finite().min(0.01).max(1000000)
const Porcentaje = z.coerce.number().finite().min(0).max(100)
const Clave = z.string().min(12).max(128).regex(/[A-Z]/).regex(/[a-z]/).regex(/\d/).regex(/[^A-Za-z0-9]/)
const Archivo = z.object({
  nombre: Texto(1,180),
  tipo: z.enum(['application/pdf','image/png','image/jpeg','image/webp']),
  datos: z.string().min(8).max(1800000).regex(/^[A-Za-z0-9+/=]+$/)
}).strict()

export const EsquemaAcceso = z.object({correo:Correo,clave:z.string().min(8).max(128)}).strict()

export const EsquemaConfirmacion = z.object({confirmacion:z.literal(true)}).strict()

export const EsquemaActivacion = z.object({
  correo:Correo,
  codigo:z.string().regex(/^\d{6}$/),
  clavetemporal:z.string().min(12).max(128),
  clavenueva:Clave
}).strict()

export const EsquemaCambioClave = z.object({
  claveactual:z.string().min(8).max(128),
  clavenueva:Clave
}).strict().refine(valor=>valor.claveactual!==valor.clavenueva,{message:'La nueva clave debe ser distinta',path:['clavenueva']})

export const EsquemaProducto = z.object({
  codigo:Texto(3,20).transform(valor=>valor.toUpperCase()).pipe(z.string().regex(/^[A-Z0-9]+$/)),
  nombre:Texto(3,120),
  descripcion:Texto(0,500),
  categoriaid:z.coerce.number().int().positive().max(1000000),
  tipoproducto:z.enum(['Papel','Cartón','Sobres','Otros']),
  material:Texto(1,80),
  grosor:Texto(1,40),
  dimensiones:Texto(1,80),
  maximopedido:CantidadStock,
  precioventa:Dinero,
  preciocompra:Dinero,
  descuentoventa:Porcentaje,
  descuentocompra:Porcentaje,
  stockactual:Stock,
  stockminimo:Stock,
  stockmensual:Stock,
  imagen:z.string().max(700000).refine(valor=>valor===''||/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(valor),'Imagen inválida')
}).strict()

export const EsquemaProveedor = z.object({
  razonsocial:Texto(3,160),
  ruc:Ruc,
  contacto:Texto(3,120).regex(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/),
  telefono:Telefono,
  correo:Correo,
  ubicacion:Texto(3,220)
}).strict()

export const EsquemaProveedorProducto = z.object({
  productoid:z.coerce.number().int().positive().max(1000000),
  preciohabitual:Dinero,
  descuentolanzamiento:Porcentaje,
  diasentrega:z.coerce.number().finite().int().min(1).max(365),
  pedidosanteriores:z.coerce.number().finite().int().min(0).max(100000),
  puntaje:z.coerce.number().finite().min(1).max(5)
}).strict()

export const EsquemaUsuario = z.object({
  nombres:Texto(2,80).regex(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/),
  apellidos:Texto(2,80).regex(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/),
  dni:Dni,
  correo:Correo,
  rol:z.enum(['Administrador','AsesorVentas','JefeAlmacen'])
}).strict()

export const EsquemaCotizacion = z.object({
  cliente:Texto(3,160),
  ruc:Ruc,
  telefono:TelefonoCelular,
  correo:CorreoCotizacion,
  productos:z.array(z.object({
    productoid:z.coerce.number().int().positive().max(1000000),
    cantidad:CantidadStock
  }).strict()).min(1).max(100)
}).strict()
  .refine(valor=>new Set(valor.productos.map(item=>item.productoid)).size===valor.productos.length,{message:'No repita productos'})

export const EsquemaContactoCotizacion = z.object({nota:Texto(3,500)}).strict()
export const EsquemaComprobanteCotizacion = z.object({archivo:Archivo}).strict()
export const EsquemaVerificacionPago = z.object({aprobado:z.boolean(),observacion:Texto(3,500)}).strict()
export const EsquemaObservacion = z.object({observacion:Texto(0,500)}).strict()

export const EsquemaMovimiento = z.object({
  productoid:z.coerce.number().int().positive().max(1000000),
  tipo:z.enum(['Entrada','Salida','Merma','Ajuste']),
  cantidad:CantidadStock,
  motivo:Texto(3,250)
}).strict()

export const EsquemaReabastecimientoManual = z.object({
  productoid:z.coerce.number().int().positive().max(1000000),
  cantidadrequerida:CantidadStock,
  observacion:Texto(3,500)
}).strict()

export const EsquemaSeleccionProveedor = z.object({
  proveedorid:z.coerce.number().int().positive().max(1000000),
  observacion:Texto(0,500)
}).strict()

export const EsquemaPagoProveedor = z.object({archivo:Archivo,observacion:Texto(0,500)}).strict()

export const EsquemaRecepcion = z.object({
  reabastecimientoid:z.coerce.number().int().positive().max(1000000),
  recibida:Stock,
  faltantes:Stock,
  defectuosos:Stock,
  observacion:Texto(3,500)
}).strict().refine(valor=>valor.recibida+valor.faltantes+valor.defectuosos<=LimiteStock,{message:'La recepción no puede superar 1000 unidades'})

export const EsquemaAuditoria = z.object({
  observacion:Texto(3,500),
  productos:z.array(z.object({
    productoid:z.coerce.number().int().positive().max(1000000),
    stockcontado:Stock
  }).strict()).min(1).max(500)
}).strict().refine(valor=>new Set(valor.productos.map(item=>item.productoid)).size===valor.productos.length,{message:'No repita productos'})

export const EsquemaEmpresa = z.object({
  nombrecomercial:Texto(2,120),
  razonsocial:Texto(2,160),
  ruc:Ruc,
  direccion:Texto(3,220),
  telefono:Telefono,
  correo:Correo,
  serie:Texto(4,4).transform(valor=>valor.toUpperCase()).pipe(z.string().regex(/^[A-Z0-9]{4}$/))
}).strict()