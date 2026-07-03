Característica: Exportación de reportes
  Como administrador
  Quiero descargar un reporte del sistema en formato .xlsx
  Para analizar la información fuera de la aplicación

  Escenario: El administrador descarga el reporte de contratos
    Dado que he iniciado sesión como administrador
    Cuando navego a "Reportes"
    Y hago clic en "Descargar" sobre el reporte "Reporte de Contratos"
    Entonces el endpoint GET /api/admin/reports/contracts/download fue llamado
    Y el navegador inicia la descarga de un archivo .xlsx
