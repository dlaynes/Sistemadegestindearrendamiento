Característica: Autenticación - manejo de errores
  Como usuario registrado de RentManager
  Quiero que se me indique claramente cuando mis credenciales son incorrectas
  Para corregirlas e intentarlo de nuevo

  Escenario: El inicio de sesión falla con un banner de error cuando las credenciales no son válidas
    Dado que estoy en la página de inicio de sesión
    Cuando ingreso un correo desconocido y una contraseña
    Y envío el formulario de inicio de sesión
    Entonces veo un banner de error en línea indicando que las credenciales no son válidas
    Y permanezco en la página de inicio de sesión
