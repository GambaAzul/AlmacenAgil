import { useState } from 'react'
import { UsarSesion } from './Contextos/Sesion'
import { Acceso } from './Paginas/Acceso'
import { Catalogo } from './Paginas/Catalogo'
import { Panel } from './Paginas/Panel'
import { VerificarBoleta } from './Paginas/VerificarBoleta'
export function Aplicacion(){const {usuario,cargando}=UsarSesion();const parametros=new URLSearchParams(location.search);const [portal]=useState(parametros.has('portal'));const [verificar]=useState(parametros.has('verificarboleta'));if(cargando)return <div className="cargando">Cargando...</div>;if(verificar)return <VerificarBoleta/>;if(!portal&&!usuario)return <Catalogo/>;if(!usuario)return <Acceso/>;return <Panel/>}