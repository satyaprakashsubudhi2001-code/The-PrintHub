import JSZip from 'jszip';

/**
 * The PrintHub — Design Submission Packaging Service
 * Bundles customer design requests, original artwork files, mockups,
 * and design specifications into a structured ZIP package (e.g. PH-2026-00001.zip).
 */

export async function generateDesignRequestZip(request) {
  const zip = new JSZip();

  const folderName = request.id || 'PH-DESIGN-REQUEST';
  const rootFolder = zip.folder(folderName);
  const artworkFolder = rootFolder.folder('original_artwork');
  const mockupsFolder = rootFolder.folder('mockups');

  // 1. Generate design.json
  const designSpec = {
    requestId: request.id,
    createdAt: request.createdAt,
    customer: request.customer,
    product: request.product,
    color: request.color,
    size: request.size,
    printMethod: request.printMethod,
    placements: request.placements,
    textLayers: request.textLayers,
    status: request.status,
    adminNotes: request.adminNotes,
  };

  rootFolder.file('design.json', JSON.stringify(designSpec, null, 2));

  // 2. Generate Markdown Summary
  const markdownSummary = `# The PrintHub — Design Request Summary
**Request ID:** ${request.id}
**Created At:** ${new Date(request.createdAt).toLocaleString()}
**Status:** ${request.status}

---

## Customer Details
- **Full Name:** ${request.customer?.name || 'N/A'}
- **WhatsApp / Mobile:** ${request.customer?.mobile || 'N/A'}
- **Email / Gmail:** ${request.customer?.email || 'N/A'}
- **Company / Brand:** ${request.customer?.company || 'N/A'}
- **Notes:** ${request.customer?.notes || 'None'}

---

## Product Specifications
- **Product:** ${request.product?.name || 'Custom Garment'}
- **Category:** ${request.product?.category || 'Apparel'}
- **Colour:** ${request.color?.name || 'N/A'} (${request.color?.hex || ''})
- **Size:** ${request.size || 'L'}
- **Print Method:** ${request.printMethod || 'DTF 300 DPI'}

---

## Print Placements & Physical Dimensions
${(request.placements || [])
  .map(
    (p, i) =>
      `${i + 1}. **${p.name}** (${p.surface || 'front'}): ${p.widthInches}" × ${p.heightInches}" physical print`
  )
  .join('\n')}

---

## Original Artwork Files
${(request.artworkFiles || [])
  .map(
    (f, i) =>
      `${i + 1}. \`${f.fileName}\` — ${f.fileType} (${f.fileSize || 'Unknown Size'})`
  )
  .join('\n')}
`;

  rootFolder.file('summary.md', markdownSummary);

  // 3. Add Original Artwork Files
  if (request.artworkFiles && request.artworkFiles.length > 0) {
    for (const file of request.artworkFiles) {
      if (file.dataUrl) {
        try {
          if (file.dataUrl.startsWith('data:')) {
            const base64Data = file.dataUrl.split(',')[1];
            artworkFolder.file(file.fileName || 'artwork.png', base64Data, { base64: true });
          } else {
            // Fetch URL
            const resp = await fetch(file.dataUrl);
            const blob = await resp.blob();
            artworkFolder.file(file.fileName || 'artwork.png', blob);
          }
        } catch (err) {
          console.warn('Could not bundle artwork file directly:', file.fileName, err);
          artworkFolder.file(`${file.fileName}.url.txt`, file.dataUrl);
        }
      }
    }
  }

  // 4. Add Mockup Files
  if (request.mockups && request.mockups.length > 0) {
    for (const mock of request.mockups) {
      if (mock.url) {
        try {
          if (mock.url.startsWith('data:')) {
            const base64Data = mock.url.split(',')[1];
            mockupsFolder.file(mock.name || `${mock.side || 'front'}.jpg`, base64Data, { base64: true });
          } else {
            const resp = await fetch(mock.url);
            const blob = await resp.blob();
            mockupsFolder.file(mock.name || `${mock.side || 'front'}.jpg`, blob);
          }
        } catch (err) {
          console.warn('Could not bundle mockup image directly:', mock.name, err);
          mockupsFolder.file(`${mock.name || 'mockup'}.url.txt`, mock.url);
        }
      }
    }
  }

  // 5. Generate and trigger download of ZIP
  const content = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `${request.id}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);

  return true;
}

/**
 * Trigger direct download of a single file dataUrl
 */
export function downloadSingleFile(dataUrl, fileName) {
  if (!dataUrl) return;
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName || 'printhub-file';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
