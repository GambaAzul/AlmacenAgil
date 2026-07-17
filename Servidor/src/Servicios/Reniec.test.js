import assert from 'node:assert/strict'
import test from 'node:test'
import { CapitalizarTexto,EdadDesdeFecha,EsMayorDeEdad,PrefijoCorreo } from './Reniec.js'

function FechaHaceAnios(anios) {
  const hoy=new Date()
  const dia=String(hoy.getDate()).padStart(2,'0')
  const mes=String(hoy.getMonth()+1).padStart(2,'0')
  return `${dia}/${mes}/${hoy.getFullYear()-anios}`
}

test('calcula la edad a partir de una fecha antigua',()=>assert.equal(EdadDesdeFecha('01/01/2000')>=18,true))
test('devuelve null con fecha inválida',()=>assert.equal(EdadDesdeFecha('no-es-fecha'),null))
test('acepta a un mayor de edad',()=>assert.equal(EsMayorDeEdad(FechaHaceAnios(25)),true))
test('rechaza a un menor de edad',()=>assert.equal(EsMayorDeEdad(FechaHaceAnios(5)),false))
test('rechaza fecha vacía',()=>assert.equal(EsMayorDeEdad(null),false))

test('capitaliza nombres y apellidos',()=>assert.equal(CapitalizarTexto('NOMBRE EJEMPLO'),'Nombre Ejemplo'))

test('genera el prefijo de correo con apellido materno',()=>assert.equal(PrefijoCorreo('NOMBRE EJEMPLO','APELLIDO MATERNO'),'napellidom'))
test('genera el prefijo de correo sin apellido materno',()=>assert.equal(PrefijoCorreo('NOMBRE','APELLIDO'),'napellido'))
