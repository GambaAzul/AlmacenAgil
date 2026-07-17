const BaseUrl='https://api-codart.cgrt.org/api/v1/consultas/fd/dni'

export async function ConsultarDni(dni) {
  const respuesta=await fetch(`${BaseUrl}/${dni}`,{
    method:'GET',
    headers:{
      Authorization:`Bearer ${process.env.TOKENDNI}`,
      'Content-Type':'application/json'
    },
    signal:AbortSignal.timeout(8000)
  })
  if (respuesta.status===404) return null
  if (!respuesta.ok) throw new Error('No se pudo consultar el DNI')
  const datos=await respuesta.json()
  if (!datos.success||!datos.data) return null
  const {nombres,apellidos,nacimiento}=datos.data
  if (!nombres||!apellidos) return null
  return {nombres,apellidos,fechanacimiento:nacimiento?.fecha||null}
}

export function EdadDesdeFecha(fecha) {
  const [dia,mes,anio]=String(fecha||'').split('/').map(Number)
  if (!dia||!mes||!anio) return null
  const nacimiento=new Date(Date.UTC(anio,mes-1,dia))
  const hoy=new Date()
  let edad=hoy.getUTCFullYear()-nacimiento.getUTCFullYear()
  const antesDelCumple=(hoy.getUTCMonth()<nacimiento.getUTCMonth())||
    (hoy.getUTCMonth()===nacimiento.getUTCMonth()&&hoy.getUTCDate()<nacimiento.getUTCDate())
  if (antesDelCumple) edad--
  return edad
}

export function EsMayorDeEdad(fecha) {
  const edad=EdadDesdeFecha(fecha)
  return edad!==null&&edad>=18
}

export function CapitalizarTexto(texto) {
  return String(texto||'').trim().split(/\s+/)
    .map(palabra=>palabra.charAt(0).toUpperCase()+palabra.slice(1).toLowerCase())
    .join(' ')
}

export function PrefijoCorreo(nombres,apellidos) {
  const primerNombre=String(nombres||'').trim().split(/\s+/)[0]||''
  const partesApellido=String(apellidos||'').trim().split(/\s+/)
  const paterno=partesApellido[0]||''
  const materno=partesApellido[1]||''
  return `${primerNombre.charAt(0)}${paterno}${materno.charAt(0)}`.toLowerCase()
}
