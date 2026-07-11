'use strict';

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('contractly', {
  listTemplates: () => ipcRenderer.invoke('templates:list'),
  getTemplate: (id) => ipcRenderer.invoke('templates:get', id),
  saveCustomTemplate: (tpl) => ipcRenderer.invoke('templates:saveCustom', tpl),
  deleteCustomTemplate: (id) => ipcRenderer.invoke('templates:deleteCustom', id),

  listContracts: () => ipcRenderer.invoke('contracts:list'),
  getContract: (id) => ipcRenderer.invoke('contracts:get', id),
  createContract: (payload) => ipcRenderer.invoke('contracts:create', payload),
  updateContract: (id, patch) => ipcRenderer.invoke('contracts:update', id, patch),
  cloneContract: (id, name) => ipcRenderer.invoke('contracts:clone', id, name),
  deleteContract: (id) => ipcRenderer.invoke('contracts:delete', id),

  mergePreview: (payload) => ipcRenderer.invoke('merge:preview', payload),
  exportPdf: (payload) => ipcRenderer.invoke('export:pdf', payload),
  exportHtml: (payload) => ipcRenderer.invoke('export:html', payload),
  showItem: (p) => ipcRenderer.invoke('shell:showItem', p),
  copyText: (t) => ipcRenderer.invoke('clipboard:writeText', t)
});
