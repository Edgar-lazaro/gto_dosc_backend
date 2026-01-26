# GTO Docs Backend 

## Pruebas Postman (Newman)

Requiere tener la API corriendo y definir variables de entorno:

- `POSTMAN_BASE_URL` (ej: `http://localhost:3000`)
- `POSTMAN_USERNAME`
- `POSTMAN_PASSWORD`

Comandos:

- Suite completa: `npm run test:postman`
- Solo health: `npm run test:postman:health`

Por seguridad, el runner guarda por defecto solo JUnit en `reports/postman-report.xml`.

Si necesitas el JSON detallado (puede incluir bodies), habilítalo explícitamente:

- `node scripts/run-postman.mjs --report-json=true`

