/**
 * Contractly smoke test — run with `npm test`.
 * Verifies with REAL data:
 *   1. Template pack integrity (15+ templates, valid HTML-ish bodies, disclaimer, variables)
 *   2. Variable extraction + labelling
 *   3. Merge engine: fills values, escapes HTML injection, marks/blanks unfilled vars
 *   4. Store CRUD on real files: create / update / clone / delete + custom templates
 *      + corrupt-file recovery
 *   5. A real PDF export through Electron printToPDF (same code path as the app),
 *      env-gated: skipped loudly if this machine can't launch Electron at all.
 */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { TEMPLATES } = require('../lib/templates');
const { extractVariables, mergeVariables, unfilledCount, labelFor } = require('../lib/merge');
const { documentHtml } = require('../lib/dochtml');
const { Store } = require('../lib/store');

let passed = 0, failed = 0;
function assert(cond, label) {
  if (cond) { passed++; console.log('  ✓ ' + label); }
  else { failed++; console.error('  ✗ FAIL: ' + label); }
}

const outDir = path.join(__dirname, 'out');
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

/* 1. Template pack */
console.log('\n[1] Template pack integrity');
assert(TEMPLATES.length >= 15, `bundles ${TEMPLATES.length} templates (>= 15 required)`);
const ids = new Set();
let allValid = true, allDisclaimed = true, allHaveVars = true, allHaveHeading = true;
for (const t of TEMPLATES) {
  if (ids.has(t.id)) allValid = false;
  ids.add(t.id);
  if (!t.name || !t.category || !t.description || !t.body_html) allValid = false;
  if (!t.body_html.includes('not legal advice')) allDisclaimed = false;
  if (extractVariables(t.body_html).length < 3) allHaveVars = false;
  if (!/<h1>/.test(t.body_html)) allHaveHeading = false;
}
assert(allValid, 'every template has unique id + name/category/description/body');
assert(allDisclaimed, 'every template embeds the not-legal-advice disclaimer');
assert(allHaveVars, 'every template has at least 3 {{variables}}');
assert(allHaveHeading, 'every template has an <h1> title');
const categories = new Set(TEMPLATES.map((t) => t.category));
assert(categories.size >= 4, `templates span ${categories.size} categories (>= 4)`);

/* 2. Variable extraction */
console.log('\n[2] Variable extraction');
const freelance = TEMPLATES.find((t) => t.id === 'freelance');
const vars = extractVariables(freelance.body_html);
assert(vars.includes('client_name') && vars.includes('contractor_name') && vars.includes('fee'),
  'freelance template exposes client_name, contractor_name, fee');
assert(vars.indexOf('effective_date') < vars.indexOf('governing_state'),
  'variables come back in document order');
assert(new Set(vars).size === vars.length, 'variable list is de-duplicated');
assert(labelFor('client_name') === 'Client name', 'labelFor humanizes snake_case');
assert(extractVariables('no variables here') .length === 0, 'no false positives on plain text');

/* 3. Merge engine */
console.log('\n[3] Merge engine');
const fields = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'sample-fields.json'), 'utf8'));
const merged = mergeVariables(freelance.body_html, fields);
assert(merged.includes('Acme Widgets LLC'), 'merged doc contains filled client name');
assert(merged.includes('$4,500 fixed fee'), 'merged doc contains filled fee');
assert(!merged.includes('{{client_name}}'), 'filled placeholders are gone');

// escaping: user data must never become markup
const evil = mergeVariables('<p>Hello {{name}}</p>', { name: '<script>alert(1)</script>&"' });
assert(!evil.includes('<script>'), 'HTML in field values is escaped');
assert(evil.includes('&lt;script&gt;') && evil.includes('&amp;'), 'escaped entities present');

// unfilled handling
const partial = mergeVariables('<p>{{a}} and {{b}}</p>', { a: 'filled' });
assert(partial.includes('mark class="unfilled"') && partial.includes('data-var="b"'),
  'unfilled vars render as highlighted <mark> in preview mode');
const blanked = mergeVariables('<p>{{a}} and {{b}}</p>', { a: 'filled' }, { unfilled: 'blank' });
assert(blanked.includes('__________') && !blanked.includes('<mark'),
  'unfilled vars render as blanks in export mode');
assert(unfilledCount(freelance.body_html, fields) === 0, 'fixture fills every freelance variable');
assert(unfilledCount(freelance.body_html, {}) === vars.length, 'empty fields → all vars unfilled');

// document shell
const doc = documentHtml(merged, { title: 'Test Contract' });
assert(doc.startsWith('<!DOCTYPE html>') && doc.includes('</html>'), 'documentHtml produces a full document');
assert(doc.includes('@page'), 'document shell carries print page setup');
fs.writeFileSync(path.join(outDir, 'merged-freelance.html'), doc);

/* 4. Store CRUD */
console.log('\n[4] Store CRUD (real files in temp dir)');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'contractly-test-'));
const store = new Store(tmp);
const c1 = store.createContract({
  template_id: 'freelance', name: 'Acme deal', body_html: freelance.body_html, fields
});
assert(!!c1.id && store.listContracts().length === 1, 'create + list');
store.updateContract(c1.id, { name: 'Acme deal v2', fields: { ...fields, fee: '$5,000' } });
const got = store.getContract(c1.id);
assert(got.name === 'Acme deal v2' && got.fields.fee === '$5,000', 'update persists name + fields');

const store2 = new Store(tmp); // reload from disk
assert(store2.getContract(c1.id).fields.client_name === 'Acme Widgets LLC', 'data survives reload from disk');
const raw = fs.readFileSync(path.join(tmp, 'contractly.json'), 'utf8');
assert(raw.charCodeAt(0) !== 0xFEFF, 'store file is BOM-free');
JSON.parse(raw); // throws if invalid
assert(true, 'store file round-trips through JSON.parse');

const clone = store2.cloneContract(c1.id);
assert(store2.listContracts().length === 2 && clone.name.includes('(copy)'), 'clone for next client');
clone.fields.client_name = 'Different Client';
assert(store2.getContract(c1.id).fields.client_name === 'Acme Widgets LLC', 'clone fields are independent');
store2.deleteContract(clone.id);
assert(store2.listContracts().length === 1, 'delete');

const ct = store2.saveCustomTemplate({ name: 'My NDA', category: 'My templates', body_html: '<h1>x {{y}}</h1>' });
assert(store2.listCustomTemplates().length === 1 && ct.id.startsWith('custom-'), 'custom template saved');
store2.deleteCustomTemplate(ct.id);
assert(store2.listCustomTemplates().length === 0, 'custom template deleted');

// corrupt-file recovery
fs.writeFileSync(path.join(tmp, 'contractly.json'), '{not json at all');
const store3 = new Store(tmp);
assert(Array.isArray(store3.listContracts()) && store3.listContracts().length === 0,
  'corrupt store file recovers to empty (with .corrupt backup)');
assert(fs.readdirSync(tmp).some((f) => f.includes('.corrupt-')), 'corrupt backup file kept');
fs.rmSync(tmp, { recursive: true, force: true });

/* 5. Real PDF export via Electron printToPDF */
console.log('\n[5] Real PDF export (Electron printToPDF)');
const electron = require('electron'); // path to electron binary when required from node
// Environment probe: machines drowning in leaked processes can exhaust
// Windows window-class/atom resources so EVERY Electron launch fails. That is
// an OS condition, not a Contractly bug — skip loudly, still gate on core logic.
const probe = spawnSync(electron, ['--version'], { encoding: 'utf8', timeout: 60000 });
if (probe.status !== 0 && /register the window class/i.test(probe.stderr || '')) {
  console.warn('  ⚠ SKIPPED: Electron cannot launch on this machine right now (window-class/atom');
  console.warn('    exhaustion — close leaked processes or reboot, then re-run `npm test`).');
} else {
  const pdfOut = path.join(outDir, 'contract-freelance.pdf');
  const res = spawnSync(electron, [path.join(__dirname, 'pdf-runner.js'), 'freelance', pdfOut], {
    encoding: 'utf8', timeout: 120000
  });
  if (res.stdout) process.stdout.write(res.stdout.split('\n').filter((l) => l.startsWith('PDF_')).map((l) => '  ' + l + '\n').join(''));
  assert(res.status === 0, 'electron pdf-runner exits 0');
  assert(fs.existsSync(pdfOut), 'PDF file written');
  if (fs.existsSync(pdfOut)) {
    const buf = fs.readFileSync(pdfOut);
    assert(buf.slice(0, 5).toString() === '%PDF-', 'output is a valid PDF (magic bytes)');
    assert(buf.length > 5000, `PDF has real content (${buf.length} bytes)`);
  }
}

console.log(`\n${'='.repeat(48)}\nSMOKE TEST: ${passed} passed, ${failed} failed\n${'='.repeat(48)}`);
process.exit(failed ? 1 : 0);
