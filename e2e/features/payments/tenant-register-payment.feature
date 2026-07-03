Característica: Registro de pago
  Como inquilino
  Quiero registrar un pago de mi contrato desde el formulario
  Para que el arrendador vea el cobro reflejado en su panel

  Escenario: El inquilino registra un nuevo pago
    Dado que he iniciado sesión como inquilino
    Cuando navego al formulario de pago de mi contrato
    Y completo los datos del pago
    Y envío el formulario
    Entonces el endpoint POST /api/tenant/payments fue llamado con el body correcto
    Y soy redirigido al detalle del pago recién creado
