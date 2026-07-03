Característica: Edición de usuario
  Como administrador
  Quiero editar el rol y el estado de un usuario existente
  Para mantener la información del sistema al día

  Escenario: El administrador cambia el rol de un usuario de arrendador a inquilino
    Dado que he iniciado sesión como administrador
    Cuando abro el detalle de un usuario arrendador
    Y edito su información
    Y cambio su rol a inquilino
    Y guardo los cambios
    Entonces el usuario queda con el rol de inquilino
    Y vuelvo al listado de usuarios
