'use strict';
/* Contractly renderer — library + editor (fields / rich text / live preview). */

const $ = (sel, el = document) => el.querySelector(sel);
const view = $('#view');
const topActions = $('#topActions');

let state = { route: 'library' };

$('#brandHome').addEventListener('click', () => showLibrary());

function toast(msg) {
  let t = $('#toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2200);
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function timeAgo(ms) {
  const s = Math.max(0, Math.floor((Date.now() - ms) / 1000));
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function labelFor(name) {
  const s = String(name).replace(/_/g, ' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* ── library ─────────────────────────────────────────────────────────── */

async function showLibrary() {
  state = { route: 'library' };
  topActions.innerHTML = '';
  const [templates, contracts] = await Promise.all([
    window.contractly.listTemplates(),
    window.contractly.listContracts()
  ]);

  const cats = [...new Set(templates.map((t) => t.category))];

  view.innerHTML = `
    <div class="library">
      <div class="lib-section">
        <div class="lib-heading">My contracts</div>
        ${contracts.length === 0
          ? '<div class="empty">No contracts yet — pick a template below to create your first one.</div>'
          : `<div class="grid" id="contractGrid"></div>`}
      </div>
      <div class="lib-section">
        <div class="lib-heading">Template library</div>
        ${cats.map((cat) => `
          <div class="lib-heading" style="font-size:11px;margin:14px 0 8px;color:#5d6b79">${esc(cat)}</div>
          <div class="grid">
            ${templates.filter((t) => t.category === cat).map((t) => `
              <div class="tpl-card" data-tpl="${esc(t.id)}">
                <span class="cat">${esc(t.category)}</span>
                <span class="name">${esc(t.name)}</span>
                <span class="desc">${esc(t.description)}</span>
                ${t.custom ? `<div class="card-actions"><button class="btn small danger" data-del-tpl="${esc(t.id)}">Delete</button></div>` : ''}
              </div>`).join('')}
          </div>`).join('')}
      </div>
    </div>`;

  if (contracts.length) {
    $('#contractGrid').innerHTML = contracts.map((c) => `
      <div class="contract-card" data-contract="${esc(c.id)}">
        <span class="name">${esc(c.name)}</span>
        <span class="meta">
          <span>updated ${timeAgo(c.updated_at)}</span>
          ${c.unfilled > 0
            ? `<span class="badge warn">${c.unfilled} blank${c.unfilled === 1 ? '' : 's'}</span>`
            : '<span class="badge ok">complete</span>'}
        </span>
        <div class="card-actions">
          <button class="btn small" data-clone="${esc(c.id)}">Clone for next client</button>
          <button class="btn small danger" data-del="${esc(c.id)}">Delete</button>
        </div>
      </div>`).join('');
  }

  view.addEventListener('click', libraryClick);
}

async function libraryClick(e) {
  const cloneBtn = e.target.closest('[data-clone]');
  if (cloneBtn) {
    e.stopPropagation();
    const c = await window.contractly.cloneContract(cloneBtn.dataset.clone);
    toast(`Cloned as "${c.name}"`);
    return openContract(c.id);
  }
  const delBtn = e.target.closest('[data-del]');
  if (delBtn) {
    e.stopPropagation();
    if (confirm('Delete this contract?')) {
      await window.contractly.deleteContract(delBtn.dataset.del);
      showLibrary();
    }
    return;
  }
  const delTpl = e.target.closest('[data-del-tpl]');
  if (delTpl) {
    e.stopPropagation();
    if (confirm('Delete this custom template?')) {
      await window.contractly.deleteCustomTemplate(delTpl.dataset.delTpl);
      showLibrary();
    }
    return;
  }
  const cCard = e.target.closest('[data-contract]');
  if (cCard) return openContract(cCard.dataset.contract);
  const tCard = e.target.closest('[data-tpl]');
  if (tCard) return createFromTemplate(tCard.dataset.tpl);
}

async function createFromTemplate(tplId) {
  const tpl = await window.contractly.getTemplate(tplId);
  if (!tpl) return;
  const contract = await window.contractly.createContract({
    template_id: tpl.id,
    name: tpl.name + ' — new client',
    body_html: tpl.body_html,
    fields: {}
  });
  openContract(contract.id);
}

/* ── editor ──────────────────────────────────────────────────────────── */

let saveTimer = null;
let previewTimer = null;

async function openContract(id) {
  const c = await window.contractly.getContract(id);
  if (!c) return showLibrary();
  state = { route: 'editor', contract: c };

  topActions.innerHTML = `
    <button class="btn" id="saveTplBtn" title="Save the edited body as a reusable template">Save as template</button>
    <button class="btn" id="exportHtmlBtn" title="Export HTML — open in Inkseal for e-signing">Export HTML</button>
    <button class="btn primary" id="exportPdfBtn">Export PDF</button>`;

  view.innerHTML = `
    <div class="editor with-strip">
      <div class="editor-strip">
        <button class="btn small" id="backBtn">← Library</button>
        <input class="title" id="titleInput" value="${esc(c.name)}" spellcheck="false">
        <span class="progress" id="fillProgress"></span>
        <span class="save-state" id="saveState"></span>
      </div>

      <aside class="fields-panel" id="fieldsPanel">
        <h3>Fill in the blanks</h3>
        <div id="fieldsList"></div>
      </aside>

      <section class="doc-panel">
        <div class="doc-toolbar">
          <button class="tb" data-cmd="bold" title="Bold"><b>B</b></button>
          <button class="tb" data-cmd="italic" title="Italic"><i>I</i></button>
          <button class="tb" data-cmd="underline" title="Underline"><u>U</u></button>
          <div class="tb-sep"></div>
          <button class="tb wide" data-block="h1" title="Title">H1</button>
          <button class="tb wide" data-block="h2" title="Section heading">H2</button>
          <button class="tb wide" data-block="p" title="Paragraph">¶</button>
          <div class="tb-sep"></div>
          <button class="tb" data-cmd="insertUnorderedList" title="Bullet list">• —</button>
          <button class="tb" data-cmd="insertOrderedList" title="Numbered list">1. —</button>
          <div class="tb-sep"></div>
          <button class="tb wide" id="insertVarBtn" title="Insert a {{variable}} at the cursor">{{var}}</button>
        </div>
        <div class="doc-editor" id="docEditor" contenteditable="true" spellcheck="false"></div>
      </section>

      <section class="preview-panel">
        <div class="preview-head">
          <span class="lbl">Live preview — exactly what exports</span>
          <button class="btn small" id="copyTextBtn" title="Copy merged plain text">Copy text</button>
        </div>
        <iframe class="preview-frame" id="previewFrame" sandbox="allow-same-origin"></iframe>
      </section>
    </div>`;

  $('#backBtn').addEventListener('click', () => { view.removeEventListener('click', libraryClick); showLibrary(); });
  $('#docEditor').innerHTML = c.body_html;

  renderFields();
  refreshPreview();

  // title
  $('#titleInput').addEventListener('input', (e) => {
    state.contract.name = e.target.value;
    scheduleSave();
  });

  // rich-text toolbar
  view.querySelectorAll('.tb[data-cmd]').forEach((b) =>
    b.addEventListener('click', () => {
      document.execCommand(b.dataset.cmd, false, null);
      onBodyEdited();
    }));
  view.querySelectorAll('.tb[data-block]').forEach((b) =>
    b.addEventListener('click', () => {
      document.execCommand('formatBlock', false, b.dataset.block);
      onBodyEdited();
    }));
  $('#insertVarBtn').addEventListener('click', () => {
    const name = prompt('Variable name (snake_case):', 'my_variable');
    if (!name) return;
    const clean = name.trim().replace(/[^a-zA-Z0-9_]/g, '_');
    document.execCommand('insertText', false, `{{${clean}}}`);
    onBodyEdited();
  });

  $('#docEditor').addEventListener('input', onBodyEdited);

  $('#exportPdfBtn').addEventListener('click', async () => {
    const r = await window.contractly.exportPdf(currentPayload());
    if (!r.canceled) { toast('PDF exported ✓'); window.contractly.showItem(r.path); }
  });
  $('#exportHtmlBtn').addEventListener('click', async () => {
    const r = await window.contractly.exportHtml(currentPayload());
    if (!r.canceled) toast('HTML exported ✓ — open it in Inkseal to collect signatures');
  });
  $('#saveTplBtn').addEventListener('click', async () => {
    const name = prompt('Template name:', state.contract.name.replace(/ — new client$/, '') + ' (my version)');
    if (!name) return;
    await window.contractly.saveCustomTemplate({
      name, category: 'My templates', description: 'Customized template', body_html: bodyHtml()
    });
    toast('Saved to your template library ✓');
  });
  $('#copyTextBtn').addEventListener('click', () => {
    const frame = $('#previewFrame');
    const text = frame.contentDocument ? frame.contentDocument.body.innerText : '';
    window.contractly.copyText(text);
    toast('Merged text copied ✓');
  });
}

function bodyHtml() {
  return $('#docEditor').innerHTML;
}

function currentPayload() {
  return { body_html: bodyHtml(), fields: state.contract.fields, title: state.contract.name };
}

function onBodyEdited() {
  state.contract.body_html = bodyHtml();
  scheduleSave();
  schedulePreview();
  // variables may have been added/removed
  clearTimeout(onBodyEdited._t);
  onBodyEdited._t = setTimeout(renderFields, 700);
}

function renderFields() {
  // extract variables client-side (same regex as lib/merge.js)
  const vars = [];
  const seen = new Set();
  const re = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;
  let m;
  const html = bodyHtml();
  while ((m = re.exec(html)) !== null) {
    if (!seen.has(m[1])) { seen.add(m[1]); vars.push(m[1]); }
  }

  const fields = state.contract.fields || {};
  const list = $('#fieldsList');
  list.innerHTML = vars.map((v) => {
    const val = fields[v] || '';
    const long = /description|scope|deliverables|milestones|assumptions|obligations|amendment|items|terms/.test(v);
    return `
      <div class="field ${val.trim() ? 'filled' : ''}">
        <label for="f_${esc(v)}">${esc(labelFor(v))}</label>
        ${long
          ? `<textarea id="f_${esc(v)}" data-var="${esc(v)}" rows="3">${esc(val)}</textarea>`
          : `<input id="f_${esc(v)}" data-var="${esc(v)}" value="${esc(val)}">`}
      </div>`;
  }).join('') || '<div class="empty" style="padding:14px">No {{variables}} in this document.</div>';

  list.querySelectorAll('[data-var]').forEach((input) => {
    input.addEventListener('input', () => {
      state.contract.fields[input.dataset.var] = input.value;
      input.closest('.field').classList.toggle('filled', input.value.trim() !== '');
      scheduleSave();
      schedulePreview();
      updateProgress(vars);
    });
  });
  updateProgress(vars);
}

function updateProgress(vars) {
  const fields = state.contract.fields || {};
  const filled = vars.filter((v) => (fields[v] || '').trim() !== '').length;
  $('#fillProgress').innerHTML = vars.length
    ? `<b>${filled}/${vars.length}</b> blanks filled`
    : '';
}

function scheduleSave() {
  const el = $('#saveState');
  el.textContent = 'saving…';
  el.classList.remove('saved');
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    await window.contractly.updateContract(state.contract.id, {
      name: state.contract.name,
      body_html: state.contract.body_html ?? bodyHtml(),
      fields: state.contract.fields
    });
    el.textContent = 'saved ✓';
    el.classList.add('saved');
  }, 600);
}

function schedulePreview() {
  clearTimeout(previewTimer);
  previewTimer = setTimeout(refreshPreview, 350);
}

async function refreshPreview() {
  const { html } = await window.contractly.mergePreview(currentPayload());
  $('#previewFrame').srcdoc = html;
}

/* boot */
showLibrary();
