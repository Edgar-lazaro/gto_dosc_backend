import axios from 'axios';

type Result = {
  name: string;
  method: 'GET' | 'POST';
  url: string;
  status: number;
  ok: boolean;
  note?: string;
};

function envOrArg(key: string, arg: string | undefined): string | undefined {
  return arg ?? process.env[key];
}

function joinUrl(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`;
}

async function main() {
  const baseUrl = envOrArg('BASE_URL', process.argv[2]) ?? 'http://localhost:3000';
  const username = envOrArg('ADMIN_USER', process.argv[3]) ?? 'admin';
  const password = envOrArg('ADMIN_PASS', process.argv[4]) ?? 'admin123';

  const client = axios.create({
    baseURL: baseUrl,
    timeout: 15000,
    validateStatus: () => true,
  });

  const results: Result[] = [];

  // Public health
  {
    const res = await client.get('/api/health');
    results.push({
      name: 'health',
      method: 'GET',
      url: '/api/health',
      status: res.status,
      ok: res.status === 200,
    });
  }

  // Login
  const loginRes = await client.post('/api/auth/login', { username, password });
  if (loginRes.status !== 201 && loginRes.status !== 200) {
    results.push({
      name: 'auth.login',
      method: 'POST',
      url: '/api/auth/login',
      status: loginRes.status,
      ok: false,
      note: `Login failed; check credentials and DB seed`,
    });
    print(results);
    process.exit(1);
  }

  const token = loginRes.data?.token as string | undefined;
  if (!token) {
    results.push({
      name: 'auth.login.token',
      method: 'POST',
      url: '/api/auth/login',
      status: loginRes.status,
      ok: false,
      note: 'No token in response',
    });
    print(results);
    process.exit(1);
  }

  const auth = axios.create({
    baseURL: baseUrl,
    timeout: 20000,
    validateStatus: () => true,
    headers: { Authorization: `Bearer ${token}` },
  });

  // Authenticated identity
  {
    const res = await auth.get('/api/auth/me');
    results.push({
      name: 'auth.me',
      method: 'GET',
      url: '/api/auth/me',
      status: res.status,
      ok: res.status === 200,
    });
  }

  const endpoints: Array<{ name: string; path: string }> = [
    // Legacy/formalized
    { name: 'documentos-pdf', path: '/api/documentos-pdf' },
    { name: 'v1.tareas', path: '/api/v1/tareas' },
    { name: 'cargos', path: '/api/cargos' },
    { name: 'gerencias', path: '/api/gerencias' },
    { name: 'jefaturas', path: '/api/jefaturas' },
    { name: 'checklists', path: '/api/checklists' },
    { name: 'notificaciones(legacy)', path: '/api/notificaciones' },
    { name: 'inventario-tics', path: '/api/inventario-tics' },
    { name: 'inventario-mantto', path: '/api/inventario-mantto' },
    { name: 'combustible', path: '/api/combustible' },
    { name: 'cl-existentes', path: '/api/cl-existentes' },
    { name: 'tarea-asignaciones', path: '/api/tarea-asignaciones' },
    { name: 'tarea-avances', path: '/api/tarea-avances' },
    { name: 'carga-car-tics', path: '/api/carga-car-tics' },
    { name: 'uso-car-tics', path: '/api/uso-car-tics' },

    // Core
    { name: 'core.notificaciones', path: '/api/core/notificaciones' },
    { name: 'core.sync-queue', path: '/api/core/sync-queue' },
    { name: 'core.tareas', path: '/api/core/tareas' },
    { name: 'core.tareas-asignadas', path: '/api/core/tareas-asignadas' },
    { name: 'core.reportes', path: '/api/core/reportes' },
    { name: 'core.evidencias', path: '/api/core/evidencias' },
    { name: 'core.reporte-comentarios', path: '/api/core/reporte-comentarios' },
    { name: 'core.reporte-participantes', path: '/api/core/reporte-participantes' },
    { name: 'core.users', path: '/api/core/users' },
    { name: 'core.asistencia', path: '/api/core/asistencia' },
  ];

  for (const e of endpoints) {
    const res = await auth.get(e.path);
    results.push({
      name: e.name,
      method: 'GET',
      url: e.path,
      status: res.status,
      ok: res.status === 200,
    });

    // FK/link sanity: if it returns rows, try GET by id.
    if (res.status === 200 && Array.isArray(res.data) && res.data.length > 0) {
      const id = res.data[0]?.id ?? res.data[0]?.id_cl ?? res.data[0]?.id_cl ?? res.data[0]?.id_cl;
      if (id !== undefined && id !== null) {
        const url = `${e.path}/${encodeURIComponent(String(id))}`;
        const one = await auth.get(url);
        results.push({
          name: `${e.name}.one`,
          method: 'GET',
          url,
          status: one.status,
          ok: one.status === 200,
        });
      }
    }
  }

  print(results);

  const failed = results.filter((r) => !r.ok);
  if (failed.length > 0) {
    process.exit(1);
  }
}

function print(results: Result[]) {
  const pad = (s: string, n: number) => (s.length >= n ? s : s + ' '.repeat(n - s.length));

  const maxName = Math.max(...results.map((r) => r.name.length), 4);
  console.log(`BASE_URL=${process.env.BASE_URL ?? ''}`.trim());
  for (const r of results) {
    const status = String(r.status);
    const ok = r.ok ? 'OK' : 'FAIL';
    const note = r.note ? ` - ${r.note}` : '';
    console.log(`${pad(r.name, maxName)}  ${pad(r.method, 4)}  ${pad(status, 3)}  ${ok}  ${r.url}${note}`);
  }

  const failed = results.filter((r) => !r.ok);
  if (failed.length) {
    console.log(`\nFAILED: ${failed.length}/${results.length}`);
  } else {
    console.log(`\nALL OK: ${results.length}`);
  }
}

main().catch((e) => {
  console.error(e?.message ?? e);
  process.exit(1);
});
