Característica: Edición de usuario
  Como administrador
  Quiero editar el rol y el estado de un usuario existente
  Para mantener la información del sistema al día

  Escenario: El administrador cambia el rol de un usuario de arrendador a inquilino
    Dado que he iniciado sesión como administrador
    Cuando navego al detalle de un usuario
    Y hago clic en "Editar usuario"
    Y cambio el rol a "inquilino"
    Y guardo los cambios
    Entonces el endpoint PUT /api/admin/users/:id fue llamado con el nuevo rol
    Y vuelvo al listado de usuarios
    Y el usuario actualizado aparece con el rol "inquilino"
