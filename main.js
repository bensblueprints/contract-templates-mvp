'use strict';

const { app, BrowserWindow, ipcMain, dialog, shell, clipboard } = require('electron');
const path = require('path');
const fs = require('fs');
const { TEMPLATES } = require('./lib/templates');
const { Store } = require('./lib/store');
const { extractVariables, mergeVariables, unfilledCount } = require('./lib/merge');
const { documentHtml } = require('./lib/dochtml');

let win = null;
let store = null;

function createWindow() {
  win = new BrowserWindow({
    width: 1360,
    height: 880,
    minWidth: 980,
    minHeight: 640,
    backgroundColor: '#0b0f14',
    autoHideMenuBar: true,
    title: 'Contractly',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  // Boot verification hook: CONTRACTLY_SMOKE=1 npm start prints a JSON
  // snapshot of the booted UI and exits (used by CI / smoke checks).
  if (process.env.CONTRACTLY_SMOKE) {
    win.webContents.once('did-finish-load', () => {
      setTimeout(async () => {
        try {
          const snap = await win.webContents.executeJavaScript(`({
            bridge: typeof window.contractly,
            templateCards: document.querySelectorAll('.tpl-card').length,
            title: document.title
          })`);
          console.log('SMOKE:' + JSON.stringify(snap));
        } catch (err) {
          console.log('SMOKE-ERROR:' + err.message);
        }
        app.exit(0);
      }, 1500);
    });
  }
}

// ── IPC ────────────────────────────────────────────────────────────────────

function allTemplates() {
  return [...TEMPLATES, ...store.listCustomTemplates()];
}

ipcMain.handle('templates:list', () =>
  allTemplates().map(({ id, name, category, description, custom }) => ({ id, name, category, description, custom: !!custom }))
);

ipcMain.handle('templates:get', (_e, id) => {
  const t = allTemplates().find((x) => x.id === id);
  if (!t) return null;
  return { ...t, variables: extractVariables(t.body_html) };
});

ipcMain.handle('templates:saveCustom', (_e, tpl) => store.saveCustomTemplate(tpl));
ipcMain.handle('templates:deleteCustom', (_e, id) => store.deleteCustomTemplate(id));

ipcMain.handle('contracts:list', () => store.listContracts().map((c) => ({
  id: c.id, name: c.name, template_id: c.template_id,
  created_at: c.created_at, updated_at: c.updated_at,
  unfilled: unfilledCount(c.body_html, c.fields)
})));
ipcMain.handle('contracts:get', (_e, id) => {
  const c = store.getContract(id);
  if (!c) return null;
  return { ...c, variables: extractVariables(c.body_html) };
});
ipcMain.handle('contracts:create', (_e, payload) => store.createContract(payload));
ipcMain.handle('contracts:update', (_e, id, patch) => store.updateContract(id, patch));
ipcMain.handle('contracts:clone', (_e, id, name) => store.cloneContract(id, name));
ipcMain.handle('contracts:delete', (_e, id) => store.deleteContract(id));

// Merge preview: returns full document HTML for the preview iframe.
ipcMain.handle('merge:preview', (_e, { body_html, fields, title }) => {
  const merged = mergeVariables(body_html, fields, { unfilled: 'mark' });
  return {
    html: documentHtml(merged, { title: title || 'Contract' }),
    unfilled: unfilledCount(body_html, fields)
  };
});

// PDF export via printToPDF on a hidden window — the same engine as preview.
ipcMain.handle('export:pdf', async (_e, { body_html, fields, title }) => {
  const { canceled, filePath } = await dialog.showSaveDialog(win, {
    title: 'Export contract as PDF',
    defaultPath: (title || 'contract').replace(/[^\w\- ]+/g, '').trim() + '.pdf',
    filters: [{ name: 'PDF', extensions: ['pdf'] }]
  });
  if (canceled || !filePath) return { canceled: true };

  const merged = mergeVariables(body_html, fields, { unfilled: 'blank' });
  const html = documentHtml(merged, { title, forPrint: true });
  const printWin = new BrowserWindow({ show: false, webPreferences: { sandbox: false } });
  try {
    await printWin.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html));
    const pdf = await printWin.webContents.printToPDF({
      pageSize: 'Letter',
      printBackground: true
    });
    fs.writeFileSync(filePath, pdf);
    return { canceled: false, path: filePath, bytes: pdf.length };
  } finally {
    printWin.destroy();
  }
});

// HTML export — for handing off to Inkseal (our e-signature app) or email.
ipcMain.handle('export:html', async (_e, { body_html, fields, title }) => {
  const { canceled, filePath } = await dialog.showSaveDialog(win, {
    title: 'Export contract as HTML',
    defaultPath: (title || 'contract').replace(/[^\w\- ]+/g, '').trim() + '.html',
    filters: [{ name: 'HTML', extensions: ['html'] }]
  });
  if (canceled || !filePath) return { canceled: true };
  const merged = mergeVariables(body_html, fields, { unfilled: 'blank' });
  fs.writeFileSync(filePath, documentHtml(merged, { title, forPrint: true }), 'utf8');
  return { canceled: false, path: filePath };
});

ipcMain.handle('shell:showItem', (_e, p) => shell.showItemInFolder(p));
ipcMain.handle('clipboard:writeText', (_e, text) => clipboard.writeText(String(text)));

app.whenReady().then(() => {
  if (process.platform === 'win32') app.setAppUserModelId('com.bensblueprints.contractly');
  store = new Store(path.join(app.getPath('userData'), 'data'));
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
