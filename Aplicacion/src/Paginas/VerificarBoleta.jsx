import { useEffect,useState } from 'react'
import { Campo } from '../Componentes/Campo'
import { Descargar,Solicitar } from '../Servicios/Api'

export function VerificarBoleta() {
  const inicial=new URLSearchParams(location.search).get('verificarboleta')||''
  const [codigo,setCodigo]=useState(inicial.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,40))
  const [boleta,setBoleta]=useState(null)
  const [error,setError]=useState('')
  const [buscando,setBuscando]=useState(false)

  const verificar=async evento=>{
    evento?.preventDefault();setError('');setBoleta(null)
    if (!/^[A-Z0-9]{20,40}$/.test(codigo)) return setError('Ingrese un código de boleta válido')
    try {
      setBuscando(true)
      const respuesta=await Solicitar(`/boletas/verificar/${codigo}`)
      setBoleta(respuesta)
    } catch (fallo) { setError(fallo.message) } finally { setBuscando(false) }
  }

  useEffect(()=>{if (/^[A-Z0-9]{20,40}$/.test(codigo)) verificar()},[])

  return <div className="fondoverificacion"><main className="verificadorboleta">
    <a className="volvercatalogo" href="/">← Volver al catálogo</a>
    <h1>Verificar boleta interna</h1>
    <p>Comprueba que el documento coincide con el registro de venta y entrega almacenado por el sistema.</p>
    <form onSubmit={verificar}>
      <Campo etiqueta="Código de verificación" value={codigo} onChange={e=>setCodigo(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,40))} minLength="20" maxLength="40" required/>
      <button className="principal" disabled={buscando}>{buscando?'Verificando...':'Verificar'}</button>
    </form>
    {error&&<div className="mensajeerror bloque">{error}</div>}
    {boleta&&<section className="resultadoboleta">
      <div className="cabeceraboleta"><div><span>Resultado</span><h2>{boleta.valida?'Documento válido':'Documento alterado'}</h2></div><b>{boleta.numero}</b></div>
      <p className="avisotributario">{boleta.aviso}</p>
      <div className="fichas">
        <div><span>Empresa</span><b>{boleta.empresa.razonsocial}</b><small>RUC {boleta.empresa.ruc}</small></div>
        <div><span>Cliente</span><b>{boleta.cliente.nombre}</b><small>{boleta.cliente.tipodocumento} {boleta.cliente.documento}</small></div>
        <div><span>Cotización</span><b>N.° {boleta.cotizacionid}</b><small>Entregada: {new Date(boleta.entregadaen).toLocaleString('es-PE')}</small></div>
        <div><span>Total</span><b>S/ {Number(boleta.total).toFixed(2)}</b><small>Emitida: {new Date(boleta.emitidaen).toLocaleString('es-PE')}</small></div>
      </div>
      <div className="tabla"><table><thead><tr><th>Código</th><th>Producto</th><th>Cantidad</th><th>Subtotal</th></tr></thead><tbody>{boleta.productos.map((item,indice)=><tr key={`${item.codigo}-${indice}`}><td>{item.codigo}</td><td>{item.nombre}</td><td>{item.cantidad}</td><td>S/ {Number(item.subtotal).toFixed(2)}</td></tr>)}</tbody></table></div>
      <div className="datosverificacion"><span>Código</span><code>{boleta.codigo}</code><span>Huella</span><code>{boleta.huella}</code></div>
      <button className="principal" onClick={()=>Descargar(`/boletas/${boleta.codigo}/pdf`,`${boleta.numero}.pdf`)}>Descargar PDF</button>
    </section>}
  </main></div>
}