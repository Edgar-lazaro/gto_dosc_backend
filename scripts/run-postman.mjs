import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import newman from 'newman';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const workspaceRoot = path.resolve(__dirname, '..');

const collectionPath = path.join(
  workspaceRoot,
  'postman',
  'GTO%20Docs%20Backend.postman_collection.json',
);
const environmentPath = path.join(
  workspaceRoot,
  'postman',
  'GTO%20Docs%20Backend.postman_environment.json',
);

function parseArgs(argv) {
  const out = {};
  for (const raw of argv) {
    if (!raw.startsWith('--')) continue;
    const arg = raw.slice(2);
    const eq = arg.indexOf('=');
    if (eq === -1) out[arg] = true;
    else out[arg.slice(0, eq)] = arg.slice(eq + 1);
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));

// Convenience alias: allow "--folder=00-Health" instead of the exact Postman folder name.
let folder = args.folder;
if (folder === '00-Health') folder = '00 - Health';

const reportJson = String(args['report-json'] ?? '').toLowerCase() === 'true';

const baseUrl = process.env.POSTMAN_BASE_URL;
const username = process.env.POSTMAN_USERNAME;
const password = process.env.POSTMAN_PASSWORD;

const envVar = [];
if (baseUrl) envVar.push({ key: 'baseUrl', value: baseUrl });
if (username) envVar.push({ key: 'username', value: username });
if (password) envVar.push({ key: 'password', value: password });

if (!baseUrl) {
  console.warn(
    '[postman] POSTMAN_BASE_URL no está definido; usando baseUrl del environment JSON',
  );
}
if (!username || !password) {
  console.warn(
    '[postman] POSTMAN_USERNAME/POSTMAN_PASSWORD no están definidos; el login puede fallar',
  );
}

const reportsDir = path.join(workspaceRoot, 'reports');
fs.mkdirSync(reportsDir, { recursive: true });

const junitReportPath = path.join(reportsDir, 'postman-report.xml');

const reporters = ['cli', 'junit'];
const reporter = {
  junit: { export: junitReportPath },
};

let jsonReportPath;
if (reportJson) {
  jsonReportPath = path.join(reportsDir, 'postman-report.json');
  reporters.push('json');
  reporter.json = { export: jsonReportPath };
  console.warn(
    '[postman] Aviso: report-json=true genera un JSON detallado que puede incluir bodies; evita usarlo con credenciales reales.',
  );
}

newman.run(
  {
    collection: JSON.parse(fs.readFileSync(collectionPath, 'utf8')),
    environment: JSON.parse(fs.readFileSync(environmentPath, 'utf8')),
    envVar,
    reporters,
    reporter,
    timeoutRequest: 60_000,
    bail: false,
    ...(folder ? { folder } : {}),
  },
  (err, summary) => {
    if (err) {
      console.error('[postman] Newman error:', err);
      process.exit(2);
    }

    const failures = summary?.run?.failures?.length ?? 0;
    if (failures > 0) {
      const reports = [junitReportPath];
      if (jsonReportPath) reports.push(jsonReportPath);
      console.error(`[postman] Fallas: ${failures}. Reportes: ${reports.join(', ')}`);
      process.exit(1);
    }

    const reports = [junitReportPath];
    if (jsonReportPath) reports.push(jsonReportPath);
    console.log(`[postman] OK. Reportes: ${reports.join(', ')}`);
    process.exit(0);
  },
);
