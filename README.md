- CSP restrictiva sin “unsafe-inline” ni “unsafe-eval”.
- HSTS, “nosniff”, protección contra marcos, CORP y COOP.
- Cookies “HttpOnly”, “Secure” en producción y “SameSite=Strict”.
- Protección de origen y token de sesión para operaciones de escritura.
- Consultas parametrizadas y transacciones con bloqueo de filas.
- Límites de solicitudes, tamaño, tiempo y conexiones.
- Validación binaria de comprobantes e imágenes.
- Validación de límites y descuentos en backend y PostgreSQL.
- Roles comprobados en backend.
- Auditoría de operaciones y revocación de sesiones.
- TLS con verificación completa para conexiones a Neon.

 Pruebas

bash
cd Servidor
npm ci
npm test


bash
cd Aplicacion
npm ci
npm run construir