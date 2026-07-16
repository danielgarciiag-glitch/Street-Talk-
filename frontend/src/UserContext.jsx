import { createContext, useState } from 'react'

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext()

export function UserProvider({ children }) {
  const [usuario, setUsuario] = useState({
    nombre: "Street Rookie",
    nivel: 1,
    xp: 0,
    xp_siguiente: 500,
    racha: 0,
    partidas: 0,
    victorias: 0,
    rango: "🥉 Street Rookie"
  })

  function calcularRango(nivel) {
    if (nivel >= 10) return "🥇 Street Legend"
    if (nivel >= 6) return "🥈 Native Vibe"
    return "🥉 Street Rookie"
  }

  function ganarXP(puntos) {
    setUsuario(prev => {
      const nuevoXP = prev.xp + puntos
      const xpSiguiente = prev.xp_siguiente || 500
      const subioNivel = nuevoXP >= xpSiguiente
      const nuevoNivel = subioNivel ? prev.nivel + 1 : prev.nivel

      return {
        ...prev,
        xp: subioNivel ? nuevoXP - xpSiguiente : nuevoXP,
        nivel: nuevoNivel,
        xp_siguiente: subioNivel ? xpSiguiente + 200 : xpSiguiente,
        victorias: prev.victorias + 1,
        partidas: prev.partidas + 1,
        rango: calcularRango(nuevoNivel)
      }
    })
  }

  function sumarPartida() {
    setUsuario(prev => ({ ...prev, partidas: prev.partidas + 1 }))
  }

  return (
    <UserContext.Provider value={{ usuario, setUsuario, ganarXP, sumarPartida }}>
      {children}
    </UserContext.Provider>
  )
}
