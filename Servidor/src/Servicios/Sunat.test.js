import assert from 'node:assert/strict'
import test from 'node:test'
import { RucEsValido } from './Sunat.js'

test('acepta ruc activo y habido',()=>assert.equal(RucEsValido({estado:'ACTIVO',condicion:'HABIDO'}),true))
test('rechaza ruc de baja',()=>assert.equal(RucEsValido({estado:'BAJA',condicion:'HABIDO'}),false))
test('rechaza ruc no habido',()=>assert.equal(RucEsValido({estado:'ACTIVO',condicion:'NO HABIDO'}),false))
test('rechaza resultado vacío',()=>assert.equal(RucEsValido(null),false))
