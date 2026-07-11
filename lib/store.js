'use strict';
/**
 * Local JSON store for contracts and user-customized templates.
 * One human-readable file: <dataDir>/contractly.json — trivial to back up.
 * Written atomically (tmp + rename) and BOM-free so JSON.parse always works.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function newId() {
  return crypto.randomBytes(8).toString('hex');
}

class Store {
  constructor(dataDir) {
    this.dataDir = dataDir;
    this.file = path.join(dataDir, 'contractly.json');
    this.data = { contracts: [], customTemplates: [] };
    this._load();
  }

  _load() {
    try {
      if (fs.existsSync(this.file)) {
        const raw = fs.readFileSync(this.file, 'utf8').replace(/^﻿/, '');
        const parsed = JSON.parse(raw);
        this.data = {
          contracts: Array.isArray(parsed.contracts) ? parsed.contracts : [],
          customTemplates: Array.isArray(parsed.customTemplates) ? parsed.customTemplates : []
        };
      }
    } catch (err) {
      // Corrupt file: keep a backup, start fresh rather than crash.
      try { fs.copyFileSync(this.file, this.file + '.corrupt-' + Date.now()); } catch (_) { /* ignore */ }
      this.data = { contracts: [], customTemplates: [] };
    }
  }

  _save() {
    fs.mkdirSync(this.dataDir, { recursive: true });
    const tmp = this.file + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(this.data, null, 2), 'utf8');
    fs.renameSync(tmp, this.file);
  }

  // ── contracts ─────────────────────────────────────────────────────────
  listContracts() {
    return [...this.data.contracts].sort((a, b) => b.updated_at - a.updated_at);
  }

  getContract(id) {
    return this.data.contracts.find((c) => c.id === id) || null;
  }

  createContract({ template_id, name, body_html, fields = {} }) {
    const now = Date.now();
    const contract = {
      id: newId(),
      template_id: template_id || null,
      name: name || 'Untitled contract',
      body_html: body_html || '',
      fields,
      created_at: now,
      updated_at: now
    };
    this.data.contracts.push(contract);
    this._save();
    return contract;
  }

  updateContract(id, patch) {
    const c = this.getContract(id);
    if (!c) return null;
    if (patch.name != null) c.name = String(patch.name);
    if (patch.body_html != null) c.body_html = String(patch.body_html);
    if (patch.fields != null && typeof patch.fields === 'object') c.fields = patch.fields;
    c.updated_at = Date.now();
    this._save();
    return c;
  }

  cloneContract(id, newName) {
    const c = this.getContract(id);
    if (!c) return null;
    const now = Date.now();
    const copy = {
      ...c,
      id: newId(),
      name: newName || c.name + ' (copy)',
      fields: { ...c.fields },
      created_at: now,
      updated_at: now
    };
    this.data.contracts.push(copy);
    this._save();
    return copy;
  }

  deleteContract(id) {
    const before = this.data.contracts.length;
    this.data.contracts = this.data.contracts.filter((c) => c.id !== id);
    this._save();
    return this.data.contracts.length < before;
  }

  // ── custom templates (user-saved variants of bundled ones) ───────────
  listCustomTemplates() {
    return [...this.data.customTemplates];
  }

  saveCustomTemplate({ name, category, description, body_html }) {
    const t = {
      id: 'custom-' + newId(),
      name: name || 'My template',
      category: category || 'My templates',
      description: description || '',
      body_html: body_html || '',
      custom: true
    };
    this.data.customTemplates.push(t);
    this._save();
    return t;
  }

  deleteCustomTemplate(id) {
    const before = this.data.customTemplates.length;
    this.data.customTemplates = this.data.customTemplates.filter((t) => t.id !== id);
    this._save();
    return this.data.customTemplates.length < before;
  }
}

module.exports = { Store, newId };
