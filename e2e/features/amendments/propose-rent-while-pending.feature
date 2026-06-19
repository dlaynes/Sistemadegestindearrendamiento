Característica: Enmiendas de contrato - bloqueo al proponer
  Como arrendador
  Quiero que se me avise cuando ya hay otra enmienda pendiente
  Para no crear accidentalmente propuestas en conflicto sobre el mismo contrato

  Escenario: Se bloquea proponer un cambio de renta mientras hay una enmienda previa pendiente
    Dado que he iniciado sesión como arrendador con una enmienda pendiente en el contrato 1
    Cuando abro el diálogo de proponer enmienda
    Entonces el diálogo muestra una advertencia indicando que ya existe una enmienda pendiente
    Y el botón de enviar está deshabilitado
