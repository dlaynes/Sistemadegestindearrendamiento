Característica: Autenticación - redirección de rutas protegidas
  Como visitante sin autenticar
  Quiero ser redirigido a la página de inicio de sesión cuando intento acceder a una página protegida
  Para no poder ver datos que no estoy autorizado a consultar

  Escenario: El acceso no autenticado a una ruta de arrendador redirige al inicio de sesión
    Dado que no tengo una sesión activa
    Cuando navego directamente a la URL del panel del arrendador
    Entonces soy redirigido a la página de inicio de sesión
