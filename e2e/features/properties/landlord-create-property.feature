Característica: Creación de propiedad
  Como arrendador
  Quiero crear una nueva propiedad desde el formulario
  Para publicarla en mi portafolio

  Escenario: El arrendador crea una propiedad nueva
    Dado que he iniciado sesión como arrendador
    Cuando navego a "Nueva Propiedad"
    Y completo el formulario con datos válidos
    Y envío el formulario
    Entonces la propiedad se guarda y vuelvo al listado
    Y el endpoint POST /api/landlord/properties fue llamado con el body correcto
