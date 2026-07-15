import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import test from 'node:test'
import { BoletaPublica,GenerarPdfBoleta } from './Boletas.js'

const contenido={
  empresa:{nombrecomercial:'ALMACÉN ÁGIL',razonsocial:'Almacén Ágil',ruc:'20123456789',direccion:'Trujillo',telefono:'987654321',correo:'ventas@almacenagil.pe'},
  cliente:{nombre:'Cliente Prueba',documento:'12345678',tipodocumento:'DNI',telefono:'987654321',correo:'cliente@correo.pe'},
  cotizacionid:15,
  creadoen:'2026-07-14T12:00:00.000Z',
  pagoverificadoen:'2026-07-14T12:30:00.000Z',
  verificadopor:'Administrador General',
  entregadaen:'2026-07-14T13:00:00.000Z',
  entregadapor:'Jorge Almacén',
  emitidaen:'2026-07-14T13:00:00.000Z',
  emitidapor:'Administrador General',
  observacionpago:'Pago verificado',
  productos:[{codigo:'PAP001',nombre:'Papel Bond A4',clasificacion:'Papel · Bond · 75 g · A4',cantidad:5,preciounitario:24.9,descuentofijo:0,descuentovolumen:10,descuentototal:10,subtotalbase:124.5,subtotal:112.05}],
  total:112.05,
  moneda:'PEN'
}
const codigo='BIV2026A1B2C3D4E5F60718293A'
const huella=crypto.createHash('sha256').update(JSON.stringify(contenido)).update(codigo).digest('hex')
const boleta={serie:'BI01',numero:'1',codigo,contenido,huella,emitidaen:contenido.emitidaen}

test('verifica huella y oculta documento',()=>{
  const publica=BoletaPublica(boleta)
  assert.equal(publica.valida,true)
  assert.equal(publica.cliente.documento,'****5678')
  assert.equal(publica.numero,'BI01-00000001')
})

test('genera PDF de boleta interna',async()=>{
  const pdf=await GenerarPdfBoleta(boleta,`https://almacen.example/?verificarboleta=${codigo}`)
  assert.equal(pdf.subarray(0,5).toString(),'%PDF-')
  assert.ok(pdf.length>5000)
})