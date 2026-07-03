Característica: Mensajería
  Como arrendador
  Quiero enviarle un mensaje a mi inquilino desde la página de mensajes
  Para mantener una comunicación directa con él

  Escenario: El arrendador envía un mensaje al inquilino
    Dado que he iniciado sesión como arrendador
    Cuando navego a "Mensajes"
    Y abro la conversación con "Tenant User"
    Y escribo un mensaje
    Y envío el mensaje
    Entonces el endpoint POST /api/conversations/:id/messages fue llamado con el contenido correcto
    Y el mensaje aparece en la conversación
