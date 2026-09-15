#!/usr/bin/env node
// Secret hygiene (PULSE-SPEC §10, last item): grep the BUILT frontend for every backend secret
// name. Pulse's hard rule #1 is "no secret ever reaches the browser" — the names must not even
// appear, because a name in the bundle means someone wired a backend env var into the frontend.
// Exit 1 on any hit so CI fails.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = join(process.cwd(), 'dist');
const PATTERN =
  /PULSE_JWT_SECRET|PULSE_ALLOWED_EMAIL|GA4_SA_JSON|BOOKVAS_SUPER|NETLIFY_TOKEN|GITHUB_WEBHOOK_SECRET|GITHUB_TOKEN|BREVO|WHATSAPP_TOKEN|ANTHROPIC_API_KEY|SPRING_MAIL_PASSWORD/g;

if (!existsSync(DIST)) {
  console.error('check:secrets — dist/ not found. Run `npm run build` first.');
  process.exit(1);
}

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) yield* walk(full);
    else yield full;
  }
}

let files = 0;
const hits = [];
for (const file of walk(DIST)) {
  files++;
  const text = readFileSync(file, 'utf8');
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    const matches = line.match(PATTERN);
    if (matches) {
      hits.push(`${relative(process.cwd(), file)}:${i + 1}  ${[...new Set(matches)].join(', ')}`);
    }
  });
}

if (hits.length) {
  console.error(`check:secrets — ${hits.length} hit(s) in ${files} file(s):`);
  for (const h of hits) console.error('  ' + h);
  process.exit(1);
}
console.log(`check:secrets — OK. ${files} file(s) in dist/ contain no secret names.`);
