Característica: Enmiendas de contrato - validación al rechazar
  Como arrendador
  Quiero que se me avise cuando mi nota de rechazo es demasiado corta
  Para no enviar accidentalmente un rechazo sin sentido

  Escenario: Se bloquea el rechazo de una enmienda con una nota de menos de 3 caracteres
    Dado que he iniciado sesión como arrendador con una enmienda de renta pendiente
    Cuando abro el diálogo de rechazar enmienda
    Y escribo una nota de rechazo de 1 carácter
    Entonces el botón de enviar está deshabilitado
    Y el diálogo muestra la pista de longitud mínima
