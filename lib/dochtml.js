'use strict';
/**
 * Wrap a merged contract body in the print-ready document shell used for
 * both the live preview iframe and the PDF export — one source of truth,
 * so what you preview is exactly what exports.
 */
function documentHtml(bodyHtml, { title = 'Contract', forPrint = false } = {}) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${String(title).replace(/</g, '&lt;')}</title>
<style>
  @page { size: Letter; margin: 1in; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 11pt;
    line-height: 1.55;
    color: #111;
    background: #fff;
    ${forPrint ? '' : 'padding: 48px 56px; max-width: 760px; margin: 0 auto;'}
  }
  h1 { font-size: 17pt; margin: 0 0 14px; letter-spacing: -0.01em; }
  h2 { font-size: 12pt; margin: 18px 0 6px; }
  p { margin: 8px 0; text-align: justify; }
  .disclaimer {
    border: 1px solid #d4a017; background: #fdf6e3; color: #7a5c00;
    padding: 8px 12px; font-size: 9pt; border-radius: 4px; text-align: left;
  }
  mark.unfilled {
    background: #fff3bf; color: #8a6d00; border-bottom: 2px dotted #d4a017;
    padding: 0 3px; border-radius: 2px; font-style: italic;
  }
  .sig-table { width: 100%; margin-top: 36px; border-collapse: collapse; }
  .sig-table td { width: 50%; vertical-align: top; padding-right: 24px; }
  ul, ol { margin: 8px 0 8px 22px; }
  strong { font-weight: 700; }
</style>
</head>
<body>${bodyHtml}</body>
</html>`;
}

module.exports = { documentHtml };
