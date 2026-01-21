# Deploy en Linux (systemd) — guía MUY paso a paso

Al final se debe poder abrir:

- `http://IP_DEL_SERVIDOR:3000/api/health`
- `http://IP_DEL_SERVIDOR:3000/api/docs`

## Decisión rápida (elige 1)

Antes de empezar, donde se podran asignar almacenar las fotos, documentos, etc.:

1) Sin NAS/NFS: se guardan en `/opt/gto_docs_backend/uploads`
2) Con NAS/NFS: se guardan en un mount `/mnt/gto_uploads` y el backend usa `UPLOADS_DIR=/mnt/gto_uploads`

## Copy/Paste rápido (solo cambia IPs)

1) Cambia `API_IP` y `NAS_IP` (y solo si aplica, `NAS_EXPORT`):

```bash
API_IP="IP_DEL_SERVIDOR"     
NAS_IP="IP_DEL_NAS"          
NAS_EXPORT="/gto_uploads"
NAS_MOUNT="/mnt/gto_uploads"
```

2) Montar NAS por NFS (prueba manual):

```bash
sudo mkdir -p "$NAS_MOUNT"
sudo mount -t nfs "$NAS_IP:$NAS_EXPORT" "$NAS_MOUNT"
findmnt | grep gto_uploads || df -h | grep gto_uploads
mkdir -p "$NAS_MOUNT/tareas"
touch "$NAS_MOUNT/tareas/_prueba_escritura.txt"
ls -la "$NAS_MOUNT/tareas/_prueba_escritura.txt"
```

3) Probar API (cuando el servicio ya esté arriba):

```bash
curl -i "http://$API_IP:3000/api/health"
curl -i "http://$API_IP:3000/api/health/db"
```

## 0) Requisitos mínimos

Necesitas:

- Un servidor Linux con acceso a la red coorporativa.
- Node.js v22 instalado.
- Acceso a Postgres (`DATABASE_URL`).
- Puerto abierto (por defecto `3000`) desde la red coorporativa.

Verifica Node:

```bash
node -v
which node
```

Debe mostrar algo como `v22.x` y una ruta tipo `/usr/bin/node`.

Verifica que puedes salir a internet (para `npm ci`) o que tengas un mirror interno:

```bash
curl -I https://registry.npmjs.org/ | head
```

## 1) Crear carpeta del proyecto

Usaremos esta ruta fija:

- `/opt/gto_docs_backend`

Crear carpeta y permisos:

```bash
sudo mkdir -p /opt/gto_docs_backend
sudo chown -R $USER:$USER /opt/gto_docs_backend
```

## 2) Copiar el proyecto

Opción A (con Git):

```bash
cd /opt/gto_docs_backend
git clone <https://github.com/Edgar-lazaro/gto_dosc_backend.git> .
```

## 3) Crear y llenar el `.env`

El servicio leerá:

- `/opt/gto_docs_backend/.env`

Crear `.env` desde el ejemplo:

```bash
cd /opt/gto_docs_backend
cp .env.example .env
```

Edita el archivo:

```bash
nano /opt/gto_docs_backend/.env
```

Pega un ejemplo mínimo (ajusta valores):

```env
HOST=0.0.0.0
PORT=3000

# IMPORTANTE: debe ser la IP/host que verán los celulares (no localhost)
PUBLIC_BASE_URL=http://IP_DEL_SERVIDOR:3000

DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DBNAME?schema=public
JWT_SECRET=cambia-esto-por-un-valor-largo

# Active Directory
AD_ENABLED=false
AD_URL=ldap://DC01.empresa.local:389
```

Verifica que no quedó vacío:

```bash
grep -E '^(PORT|PUBLIC_BASE_URL|DATABASE_URL|JWT_SECRET)=' /opt/gto_docs_backend/.env
```

## 4) NAS/NFS para uploads

## 4.1 Crear punto de montaje

Ejemplo:

```bash
sudo mkdir -p /mnt/gto_uploads
```

### 4.2 Montar el NFS (prueba manual)

```bash
sudo mount -t nfs <IP_DEL_NAS>:/<EXPORT> /mnt/gto_uploads
```

Verifica que está montado:

```bash
findmnt | grep gto_uploads || df -h | grep gto_uploads
```

### 4.3 Hacerlo persistente (al reiniciar)

Edita `/etc/fstab`:

```bash
sudo nano /etc/fstab
```

Agrega una línea como ejemplo (ajusta):

```fstab
<IP_DEL_NAS>:/<EXPORT>  /mnt/gto_uploads  nfs  rw,_netdev,hard,timeo=600,retrans=2  0  0
```

Aplica:

```bash
sudo mount -a
```

### 4.4 Validar permisos de escritura

Esto debe funcionar (si falla, es tema de permisos/mapeo UID/GID del NFS):

```bash
mkdir -p /mnt/gto_uploads/tareas
touch /mnt/gto_uploads/tareas/_prueba_escritura.txt
ls -la /mnt/gto_uploads/tareas/_prueba_escritura.txt
```

Nota importante: en NFS (especialmente desde Windows NFS) el control de permisos depende mucho del mapeo de UID/GID. Si aquí falla con “Permission denied”, hay que corregir la configuración del export/mapeo.

### 4.5 Configurar el backend para usar el mount

En `/opt/gto_docs_backend/.env` agrega:

```env
UPLOADS_DIR=/mnt/gto_uploads
```

## 5) Instalar dependencias + compilar

Desde `/opt/gto_docs_backend`:

```bash
cd /opt/gto_docs_backend
npm ci
npm run prisma:generate
npm run build
```

Si no se va a usar NAS/NFS (modo simple), crear carpeta local de uploads:

```bash
mkdir -p /opt/gto_docs_backend/uploads/tareas
```

Si se va a usar NAS/NFS, crear la carpeta en el mount (si no existe):

```bash
mkdir -p /mnt/gto_uploads/tareas
```

## 6) Instalar el servicio systemd

El unit file viene en el repo:

- `deploy/gto-docs-backend.service`

Copiarlo a systemd:

```bash
sudo cp /opt/gto_docs_backend/deploy/gto-docs-backend.service /etc/systemd/system/gto-docs-backend.service
```

### 6.1 (Solo si usas NAS/NFS) permitir escritura en el mount

El unit file tiene hardening y por defecto solo permite escribir en `/opt/gto_docs_backend/uploads`.

Si usas `UPLOADS_DIR=/mnt/gto_uploads`, entonces edita:

```bash
sudo nano /etc/systemd/system/gto-docs-backend.service
```

Busca la línea `ReadWritePaths=...` y agrega el mount. Ejemplo:

```ini
ReadWritePaths=/opt/gto_docs_backend/uploads /mnt/gto_uploads
```

### 6.2 Activar y arrancar

```bash
sudo systemctl daemon-reload
sudo systemctl enable gto-docs-backend
sudo systemctl restart gto-docs-backend
```

Ver estado:

```bash
sudo systemctl status gto-docs-backend --no-pager
```

Ver logs en vivo:

```bash
sudo journalctl -u gto-docs-backend -f
```

## 7) Probar que responde

Desde el servidor:

```bash
curl -i http://localhost:3000/api/health
curl -i http://localhost:3000/api/health/db
```

Desde otro equipo en la intranet:

```bash
curl -i http://IP_DEL_SERVIDOR:3000/api/health
```

En el navegador:

- `http://IP_DEL_SERVIDOR:3000/api/docs`

## Checklist final (si algo falla)

1) ¿Está corriendo el servicio?

```bash
sudo systemctl status gto-docs-backend --no-pager
```

2) ¿Qué dicen los logs?

```bash
sudo journalctl -u gto-docs-backend -n 200 --no-pager
```

3) ¿El puerto está abierto/escuchando?

```bash
sudo lsof -iTCP:3000 -sTCP:LISTEN
```

4) (Si se usa NAS) ¿El mount existe y se puede escribir?

```bash
findmnt | grep gto_uploads || df -h | grep gto_uploads
touch /mnt/gto_uploads/tareas/_prueba_escritura.txt
```

## Troubleshooting rápido

- Cambiaste `.env` y no se refleja: `sudo systemctl restart gto-docs-backend`
- “Permission denied” al subir adjuntos (NAS): permisos/mapeo NFS o falta agregar mount en `ReadWritePaths`
- `npm ci` falla: revisar proxy/firewall o acceso a registry
- No conecta a Postgres: revisar `DATABASE_URL` y conectividad a DB
