Característica: Autenticación
  Como usuario registrado de RentManager
  Quiero iniciar sesión con mi correo y contraseña
  Para acceder al panel correspondiente a mi rol

  Escenario: Inicio de sesión exitoso para un arrendador
    Dado que estoy en la página de inicio de sesión
    Cuando ingreso credenciales válidas de arrendador
    Y envío el formulario de inicio de sesión
    Entonces soy redirigido al panel del arrendador
    Y puedo ver la identidad del arrendador en la barra lateral
