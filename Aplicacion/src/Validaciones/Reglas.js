export const LimiteStock=1000

export const SoloNumeros=v=>String(v??'').replace(/\D/g,'')
export const Limitar=(v,n)=>String(v??'').slice(0,n)
export const CorreoValido=v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v??'').trim())
export const ClaveValida=v=>v.length>=12&&/[A-Z]/.test(v)&&/[a-z]/.test(v)&&/\d/.test(v)&&/[^A-Za-z0-9]/.test(v)

export function EnteroLimitado(valor,maximo=LimiteStock,minimo=0) {
  const limpio=SoloNumeros(valor).slice(0,String(maximo).length+1)
  if (!limpio) return ''
  return String(Math.min(maximo,Math.max(minimo,Number(limpio))))
}

export function DecimalLimitado(valor,maximo=1000000,decimales=2) {
  const texto=String(valor??'').replace(',','.').replace(/[^0-9.]/g,'')
  const partes=texto.split('.')
  const entero=(partes.shift()||'').slice(0,12)
  const decimal=partes.join('').slice(0,decimales)
  const combinado=decimal||texto.endsWith('.')?`${entero||'0'}.${decimal}`:entero
  if (!combinado) return ''
  const numero=Number(combinado)
  if (Number.isFinite(numero)&&numero>maximo) return String(maximo)
  return combinado
}

export function NombrePersona(valor,maximo=80) {
  return String(valor??'').replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]/g,'').replace(/\s{2,}/g,' ').slice(0,maximo)
}