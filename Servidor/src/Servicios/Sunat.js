const BaseUrl='https://api-codart.cgrt.org/api/v1/consultas/sunat/ruc'

export function RucEsValido(resultado) {
  return Boolean(resultado)&&resultado.estado==='ACTIVO'&&resultado.condicion==='HABIDO'
}

export async function ConsultarRuc(ruc) {
  const respuesta=await fetch(`${BaseUrl}/${ruc}`,{
    method:'GET',
    headers:{
      Authorization:`Bearer ${process.env.TOKENSUNAT}`,
      'Content-Type':'application/json'
    },
    signal:AbortSignal.timeout(8000)
  })
  if (respuesta.status===404) return null
  if (!respuesta.ok) throw new Error('No se pudo consultar el RUC')
  const datos=await respuesta.json()
  if (!datos.success||!datos.result) return null
  return datos.result
}
