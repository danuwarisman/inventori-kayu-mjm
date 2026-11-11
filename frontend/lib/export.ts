export type ExportFileFormat = 'xls' | 'csv' | 'pdf';

export interface ExportDocumentSection {
  title: string;
  columns: string[];
  rows: string[][];
}

export interface ExportDocument {
  title: string;
  subtitle?: string;
  sections: ExportDocumentSection[];
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeCsv(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function buildSectionsHtml(documentData: ExportDocument): string {
  return documentData.sections
    .map(
      (section) => `
        <section>
          <h2>${escapeHtml(section.title)}</h2>
          <table>
            <thead>
              <tr>${section.columns
                .map((column) => `<th>${escapeHtml(column)}</th>`)
                .join('')}</tr>
            </thead>
            <tbody>
              ${
                section.rows.length > 0
                  ? section.rows
                      .map(
                        (row) =>
                          `<tr>${row
                            .map((cell) => `<td>${escapeHtml(cell)}</td>`)
                            .join('')}</tr>`
                      )
                      .join('')
                  : `<tr><td colspan="${section.columns.length}" class="empty">Tidak ada data</td></tr>`
              }
            </tbody>
          </table>
        </section>
      `
    )
    .join('');
}

function buildDocumentHtml(document: ExportDocument): string {
  return `<!doctype html>
<html lang="id">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(document.title)}</title>
    <style>
      @page { size: A4 landscape; margin: 10mm; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        color: #1c1917;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 11px;
      }
      h1 { margin: 0 0 4px; color: #15803d; font-size: 18px; }
      .subtitle { margin: 0 0 18px; color: #57534e; font-size: 11px; }
      section { margin-bottom: 22px; page-break-inside: auto; }
      h2 {
        margin: 0 0 8px;
        padding-bottom: 5px;
        border-bottom: 2px solid #15803d;
        color: #15803d;
        font-size: 13px;
      }
      table { width: 100%; border-collapse: collapse; }
      th {
        background: #dcfce7;
        color: #14532d;
        font-size: 10px;
        text-align: left;
        text-transform: uppercase;
      }
      th, td {
        padding: 6px 7px;
        border: 1px solid #d6d3d1;
        vertical-align: top;
      }
      tbody tr:nth-child(even) { background: #fafaf9; }
      .empty { color: #78716c; text-align: center; }
    </style>
  </head>
  <body>
    <h1>${escapeHtml(document.title)}</h1>
    ${document.subtitle ? `<p class="subtitle">${escapeHtml(document.subtitle)}</p>` : ''}
    ${buildSectionsHtml(document)}
  </body>
</html>`;
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportToPdf(documentData: ExportDocument): void {
  const iframe = document.createElement('iframe');
  iframe.title = 'MJM PDF Export';
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';

  document.body.appendChild(iframe);

  const frameWindow = iframe.contentWindow;
  const frameDocument = frameWindow?.document;

  if (!frameWindow || !frameDocument) {
    iframe.remove();
    throw new Error('Browser tidak mendukung proses export PDF.');
  }

  frameDocument.open();
  frameDocument.write(buildDocumentHtml(documentData));
  frameDocument.close();

  let cleanedUp = false;
  const cleanup = () => {
    if (cleanedUp) return;
    cleanedUp = true;
    iframe.remove();
  };

  frameWindow.onafterprint = cleanup;
  window.setTimeout(cleanup, 5 * 60 * 1000);
  window.setTimeout(() => {
    frameWindow.focus();
    frameWindow.print();
  }, 150);
}

export function downloadCsv(
  filename: string,
  documentData: ExportDocument
): void {
  const lines: string[] = [];

  documentData.sections.forEach((section, index) => {
    if (index > 0) lines.push('');
    lines.push(escapeCsv(section.title));
    lines.push(section.columns.map(escapeCsv).join(','));
    section.rows.forEach((row) => {
      lines.push(row.map(escapeCsv).join(','));
    });
  });

  const blob = new Blob([`\uFEFF${lines.join('\r\n')}`], {
    type: 'text/csv;charset=utf-8;',
  });

  downloadBlob(blob, `${filename}.csv`);
}

export function downloadExcel(
  filename: string,
  documentData: ExportDocument
): void {
  const html = `<!doctype html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta charset="utf-8" />
    <style>
      table { border-collapse: collapse; }
      th, td { border: 1px solid #a8a29e; padding: 4px 6px; }
      th { background: #dcfce7; color: #14532d; font-weight: bold; }
    </style>
  </head>
  <body>
    <h1>${escapeHtml(documentData.title)}</h1>
    ${documentData.subtitle ? `<p>${escapeHtml(documentData.subtitle)}</p>` : ''}
    ${buildSectionsHtml(documentData)}
  </body>
</html>`;

  const blob = new Blob([`\uFEFF${html}`], {
    type: 'application/vnd.ms-excel;charset=utf-8;',
  });

  downloadBlob(blob, `${filename}.xls`);
}

export function downloadExportFile(
  format: ExportFileFormat,
  filename: string,
  documentData: ExportDocument
): void {
  if (format === 'pdf') {
    exportToPdf(documentData);
    return;
  }

  if (format === 'csv') {
    downloadCsv(filename, documentData);
    return;
  }

  downloadExcel(filename, documentData);
}

/* ------------------------------------------------------------------ */
/* Cetak Dokumen Resmi PT Margi Jati Makmur (PO, Invoice, Surat Jalan) */
/* ------------------------------------------------------------------ */

export interface OfficialDocumentMeta {
  label: string;
  value: string;
}

export interface OfficialDocumentSignature {
  roleTitle: string;
  name?: string;
}

export interface OfficialDocumentData {
  documentType: 'PURCHASE ORDER (PO)' | 'INVOICE PENJUALAN' | 'SURAT JALAN';
  documentNumber: string;
  documentDate: string;
  statusLabel: string;
  recipientTitle: string;
  recipientName: string;
  recipientAddress?: string;
  recipientPhone?: string;
  meta: OfficialDocumentMeta[];
  columns: string[];
  rows: string[][];
  summaryRows?: { label: string; value: string; bold?: boolean }[];
  notes?: string;
  signatures: OfficialDocumentSignature[];
}

function buildOfficialDocumentHtml(doc: OfficialDocumentData): string {
  const metaHtml = doc.meta
    .map(
      (m) => `
        <div class="meta-row">
          <span class="meta-label">${escapeHtml(m.label)}</span>
          <span class="meta-sep">:</span>
          <span class="meta-val">${escapeHtml(m.value)}</span>
        </div>`
    )
    .join('');

  const rowsHtml =
    doc.rows.length > 0
      ? doc.rows
          .map(
            (row) =>
              `<tr>${row
                .map((cell, idx) => `<td class="${idx === 0 ? 'center' : ''}">${escapeHtml(cell)}</td>`)
                .join('')}</tr>`
          )
          .join('')
      : `<tr><td colspan="${doc.columns.length}" class="center muted">Tidak ada rincian item</td></tr>`;

  const summaryHtml = (doc.summaryRows ?? [])
    .map(
      (s) => `
        <tr class="summary-row ${s.bold ? 'summary-bold' : ''}">
          <td colspan="${Math.max(1, doc.columns.length - 1)}" class="right">${escapeHtml(s.label)}</td>
          <td class="right">${escapeHtml(s.value)}</td>
        </tr>`
    )
    .join('');

  const signaturesHtml = doc.signatures
    .map(
      (sig) => `
        <div class="sig-box">
          <div class="sig-title">${escapeHtml(sig.roleTitle)}</div>
          <div class="sig-space"></div>
          <div class="sig-name">${escapeHtml(sig.name || '( ................................. )')}</div>
        </div>`
    )
    .join('');

  return `<!doctype html>
<html lang="id">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(doc.documentType)} - ${escapeHtml(doc.documentNumber)}</title>
    <style>
      @page { size: A4 portrait; margin: 14mm; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        color: #1c1917;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 11px;
        line-height: 1.45;
      }
      .letterhead {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding-bottom: 12px;
        border-bottom: 3px double #15803d;
        margin-bottom: 16px;
      }
      .company-name {
        font-size: 20px;
        font-weight: 800;
        color: #14532d;
        letter-spacing: 0.5px;
        margin: 0 0 3px;
      }
      .company-sub {
        font-size: 10px;
        color: #57534e;
        margin: 0;
      }
      .doc-badge {
        text-align: right;
      }
      .doc-type {
        font-size: 16px;
        font-weight: 800;
        color: #15803d;
        margin: 0 0 4px;
      }
      .doc-number {
        font-family: monospace;
        font-size: 12px;
        font-weight: 700;
        color: #1c1917;
        background: #dcfce7;
        padding: 2px 8px;
        border-radius: 4px;
        display: inline-block;
      }
      .info-grid {
        display: flex;
        justify-content: space-between;
        gap: 20px;
        margin-bottom: 16px;
      }
      .recipient-box, .meta-box {
        flex: 1;
        padding: 10px 12px;
        border: 1px solid #d6d3d1;
        border-radius: 6px;
        background: #fafaf9;
      }
      .box-caption {
        font-size: 9px;
        font-weight: 700;
        text-transform: uppercase;
        color: #15803d;
        margin-bottom: 4px;
      }
      .recipient-name {
        font-size: 13px;
        font-weight: 700;
        color: #1c1917;
        margin-bottom: 2px;
      }
      .recipient-detail {
        font-size: 10.5px;
        color: #57534e;
      }
      .meta-row {
        display: flex;
        margin-bottom: 3px;
      }
      .meta-label {
        width: 115px;
        color: #57534e;
        font-weight: 600;
      }
      .meta-sep {
        width: 10px;
      }
      .meta-val {
        flex: 1;
        font-weight: 700;
        color: #1c1917;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 14px;
      }
      th {
        background: #15803d;
        color: #ffffff;
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        padding: 7px 8px;
        border: 1px solid #15803d;
      }
      td {
        padding: 7px 8px;
        border: 1px solid #d6d3d1;
        vertical-align: top;
      }
      tbody tr:nth-child(even) {
        background: #fafaf9;
      }
      .summary-row td {
        background: #f5f5f4;
        font-weight: 600;
      }
      .summary-bold td {
        background: #dcfce7;
        color: #14532d;
        font-weight: 800;
        font-size: 12px;
      }
      .center { text-align: center; }
      .right { text-align: right; }
      .muted { color: #78716c; }
      .notes-box {
        padding: 8px 12px;
        border-left: 3px solid #15803d;
        background: #f5f5f4;
        font-size: 10.5px;
        margin-bottom: 24px;
      }
      .sig-grid {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        margin-top: 28px;
        page-break-inside: avoid;
      }
      .sig-box {
        flex: 1;
        text-align: center;
      }
      .sig-title {
        font-size: 10.5px;
        font-weight: 700;
        color: #44403c;
      }
      .sig-space {
        height: 60px;
      }
      .sig-name {
        font-size: 11px;
        font-weight: 700;
        color: #1c1917;
        border-top: 1px solid #78716c;
        display: inline-block;
        min-width: 150px;
        padding-top: 4px;
      }
      .footer-note {
        margin-top: 20px;
        padding-top: 8px;
        border-top: 1px dashed #d6d3d1;
        font-size: 9.5px;
        color: #78716c;
        display: flex;
        justify-content: space-between;
      }
    </style>
  </head>
  <body>
    <div class="letterhead">
      <div>
        <div class="company-name">PT MARGI JATI MAKMUR</div>
        <p class="company-sub">Industri Pengolahan Kayu Log, Sawmill, &amp; Pengeringan Dry-Kiln</p>
        <p class="company-sub">Jawa Tengah, Indonesia | Email: operasional@margijatimakmur.co.id</p>
      </div>
      <div class="doc-badge">
        <div class="doc-type">${escapeHtml(doc.documentType)}</div>
        <div class="doc-number">${escapeHtml(doc.documentNumber)}</div>
      </div>
    </div>

    <div class="info-grid">
      <div class="recipient-box">
        <div class="box-caption">${escapeHtml(doc.recipientTitle)}</div>
        <div class="recipient-name">${escapeHtml(doc.recipientName)}</div>
        ${doc.recipientAddress ? `<div class="recipient-detail">${escapeHtml(doc.recipientAddress)}</div>` : ''}
        ${doc.recipientPhone ? `<div class="recipient-detail">Telp: ${escapeHtml(doc.recipientPhone)}</div>` : ''}
      </div>
      <div class="meta-box">
        <div class="box-caption">Informasi Dokumen</div>
        <div class="meta-row">
          <span class="meta-label">Tanggal</span>
          <span class="meta-sep">:</span>
          <span class="meta-val">${escapeHtml(doc.documentDate)}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Status</span>
          <span class="meta-sep">:</span>
          <span class="meta-val">${escapeHtml(doc.statusLabel)}</span>
        </div>
        ${metaHtml}
      </div>
    </div>

    <table>
      <thead>
        <tr>${doc.columns.map((c) => `<th>${escapeHtml(c)}</th>`).join('')}</tr>
      </thead>
      <tbody>
        ${rowsHtml}
        ${summaryHtml}
      </tbody>
    </table>

    ${
      doc.notes
        ? `<div class="notes-box"><strong>Catatan:</strong> ${escapeHtml(doc.notes)}</div>`
        : ''
    }

    <div class="sig-grid">
      ${signaturesHtml}
    </div>

    <div class="footer-note">
      <span>Dicetak dari Sistem Inventori Kayu PT Margi Jati Makmur</span>
      <span>Waktu Cetak: ${escapeHtml(new Date().toLocaleString('id-ID'))}</span>
    </div>
  </body>
</html>`;
}

export function printOfficialDocument(doc: OfficialDocumentData): void {
  const iframe = document.createElement('iframe');
  iframe.title = `${doc.documentType} - ${doc.documentNumber}`;
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';

  document.body.appendChild(iframe);

  const frameWindow = iframe.contentWindow;
  const frameDocument = frameWindow?.document;

  if (!frameWindow || !frameDocument) {
    iframe.remove();
    throw new Error('Browser tidak mendukung proses cetak dokumen.');
  }

  frameDocument.open();
  frameDocument.write(buildOfficialDocumentHtml(doc));
  frameDocument.close();

  let cleanedUp = false;
  const cleanup = () => {
    if (cleanedUp) return;
    cleanedUp = true;
    iframe.remove();
  };

  frameWindow.onafterprint = cleanup;
  window.setTimeout(cleanup, 5 * 60 * 1000);
  window.setTimeout(() => {
    frameWindow.focus();
    frameWindow.print();
  }, 150);
}

