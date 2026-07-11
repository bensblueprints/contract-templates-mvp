/**
 * Runs inside Electron (spawned by test/smoke.js).
 * Merges a real template with fixture values and exports a real PDF via
 * printToPDF — the exact code path the Export PDF button uses.
 * Usage: electron test/pdf-runner.js <templateId> <outFile>
 */
'use strict';

const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { TEMPLATES } = require('../lib/templates');
const { mergeVariables } = require('../lib/merge');
const { documentHtml } = require('../lib/dochtml');

const templateId = process.argv[2] || 'freelance';
const outFile = process.argv[3] || path.join(__dirname, 'out', 'contract.pdf');

app.setPath('userData', path.join(os.tmpdir(), 'contractly-pdf-test-' + process.pid));
app.disableHardwareAcceleration();

app.whenReady().then(async () => {
  try {
    const tpl = TEMPLATES.find((t) => t.id === templateId);
    if (!tpl) throw new Error('unknown template: ' + templateId);
    const fields = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'sample-fields.json'), 'utf8'));
    const merged = mergeVariables(tpl.body_html, fields, { unfilled: 'blank' });
    const html = documentHtml(merged, { title: tpl.name, forPrint: true });

    const win = new BrowserWindow({ show: false, webPreferences: { sandbox: false } });
    await win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html));
    const pdf = await win.webContents.printToPDF({ pageSize: 'Letter', printBackground: true });
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, pdf);
    console.log('PDF_OK ' + outFile + ' ' + pdf.length);
    app.exit(0);
  } catch (err) {
    console.error('PDF_FAIL ' + ((err && err.stack) || err));
    app.exit(1);
  }
});
