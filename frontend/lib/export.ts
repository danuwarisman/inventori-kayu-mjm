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
