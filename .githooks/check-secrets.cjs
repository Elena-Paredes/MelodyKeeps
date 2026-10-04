// Bloquea commits con credenciales. Se ejecuta desde .githooks/pre-commit.
const { execSync } = require('child_process');
const fs = require('fs');

const git = (cmd) => execSync(cmd, { encoding: 'buffer', maxBuffer: 1 << 28 });
const staged = git('git diff --cached --name-only --diff-filter=ACMR -z').toString('utf8').split('\0').filter(Boolean);

const problems = [];

// 1) nombres de archivo prohibidos
const bannedName = [
  /(^|\/)\.env(\.[^/]*)?$/i,
  /\.(pem|key|pfx|p12|crt|cer|jks|keystore)$/i,
  /(^|\/)id_rsa/i,
  /(^|\/)secrets?\.json$/i,
  /(^|\/)appsettings\.[^/]+\.json$/i,
];
const allowedName = [/\.example(\.[^/]*)?$/i, /(^|\/)appsettings\.[^/.]+\.example\.json$/i];
for (const f of staged) {
  if (bannedName.some((r) => r.test(f)) && !allowedName.some((r) => r.test(f))) problems.push(`archivo de credenciales: ${f}`);
}

// 2) valores reales (leídos del appsettings.Development.json local) dentro del contenido staged
const secrets = new Set();
const pwPatterns = new Set(); // contraseñas comunes: solo se buscan como "Password=<valor>"
const devFile = 'melodykeeps-backend/src/MelodyKeeps.Api/appsettings.Development.json';
if (fs.existsSync(devFile)) {
  const walk = (o) => {
    for (const [k, v] of Object.entries(o)) {
      if (v && typeof v === 'object') walk(v);
      else if (typeof v === 'string') {
        const pw = v.match(/Password=([^;]+)/i);
        if (pw && pw[1].length >= 6) (pw[1].length >= 12 && !/melodykeeps/i.test(pw[1]) ? secrets : pwPatterns).add(pw[1]);
        if (/(key|secret|password|token|clientid)/i.test(k) && v.length >= 8) secrets.add(v);
      }
    }
  };
  try { walk(JSON.parse(fs.readFileSync(devFile, 'utf8'))); } catch { problems.push(`no se pudo leer ${devFile}; no se puede verificar el contenido`); }
}
for (const f of staged) {
  const buf = git(`git show ":${f}"`);
  if (buf.includes(0)) continue; // binario
  const text = buf.toString('utf8');
  for (const s of secrets) if (text.includes(s)) problems.push(`valor secreto real dentro de: ${f}`);
  for (const s of pwPatterns) if (new RegExp('Password\\s*=\\s*' + s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(text)) problems.push(`contraseña real (Password=...) dentro de: ${f}`);
}

if (problems.length) {
  console.error('\n✖ COMMIT BLOQUEADO: se detectaron credenciales.\n');
  [...new Set(problems)].forEach((p) => console.error('  - ' + p));
  console.error('\nQuita esos archivos/valores (git restore --staged <archivo>) y usa appsettings.Development.json o variables de entorno.\n');
  process.exit(1);
}
