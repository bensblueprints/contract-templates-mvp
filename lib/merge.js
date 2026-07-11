'use strict';
/**
 * Variable merge engine.
 * Templates contain {{snake_case}} placeholders inside their HTML body.
 * - extractVariables(html)  → ordered unique list of variable names
 * - mergeVariables(html, values, opts) → html with placeholders replaced.
 *   Values are HTML-escaped (user input never becomes markup).
 *   Unfilled variables render as a highlighted <mark> so they're impossible
 *   to miss in the preview; for export you can render them as blanks.
 */

const VAR_RE = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function extractVariables(html) {
  const seen = new Set();
  const out = [];
  let m;
  VAR_RE.lastIndex = 0;
  while ((m = VAR_RE.exec(String(html))) !== null) {
    if (!seen.has(m[1])) {
      seen.add(m[1]);
      out.push(m[1]);
    }
  }
  return out;
}

/** Turn snake_case into a friendly label: client_name → Client name */
function labelFor(name) {
  const s = String(name).replace(/_/g, ' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * @param {string} html      template body
 * @param {object} values    { var_name: 'value' }
 * @param {object} [opts]
 * @param {'mark'|'blank'} [opts.unfilled='mark']  how to render missing values
 */
function mergeVariables(html, values = {}, opts = {}) {
  const unfilled = opts.unfilled || 'mark';
  VAR_RE.lastIndex = 0;
  return String(html).replace(VAR_RE, (_, name) => {
    const v = values[name];
    if (v != null && String(v).trim() !== '') {
      return escapeHtml(String(v));
    }
    if (unfilled === 'blank') return '__________';
    return `<mark class="unfilled" data-var="${escapeHtml(name)}">${escapeHtml(labelFor(name))}</mark>`;
  });
}

/** Count how many variables still lack a value. */
function unfilledCount(html, values = {}) {
  return extractVariables(html).filter((n) => values[n] == null || String(values[n]).trim() === '').length;
}

module.exports = { extractVariables, mergeVariables, unfilledCount, labelFor, escapeHtml, VAR_RE };
