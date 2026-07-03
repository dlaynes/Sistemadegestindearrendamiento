Característica: Cierre de contrato por mutuo acuerdo
  Como arrendador
  Quiero aprobar una propuesta de cierre de contrato del inquilino
  Para cancelar el contrato y todos los pagos pendientes asociados

  Escenario: El arrendador aprueba el cierre del contrato y los pagos pendientes pasan a cancelado
    Dado que he iniciado sesión como arrendador
    Y existe un amendment de cierre pendiente en el contrato 1 (propuesto por el inquilino)
    Cuando navego al detalle del contrato
    Y apruebo el amendment de cierre
    Entonces el endpoint POST /api/landlord/contracts/1/amendments/:id/decision fue llamado
    Y el contrato pasa a estado "cancelado"
    Y los pagos pendientes del contrato pasan a estado "cancelado"
