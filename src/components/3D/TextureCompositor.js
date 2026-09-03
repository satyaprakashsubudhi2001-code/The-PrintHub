import * as THREE from 'three';

// Cache for loaded HTML images
const imageCache = new Map();
// Cache for procedural bump textures to prevent 260k-pixel CPU calculations on every render
const bumpTextureCache = new Map();

/**
 * Loads an image from URL / data URI and caches it
 */
export function preloadImage(src) {
  if (!src) return Promise.resolve(null);
  if (imageCache.has(src)) {
    return Promise.resolve(imageCache.get(src));
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = (err) => {
      console.warn('Failed to load image for texture:', src);
      resolve(null);
    };
    img.src = src;
  });
}

/**
 * Creates a procedural fabric weave bump map (Cached)
 */
export function createFabricBumpTexture(fabricType = 'cotton') {
  if (bumpTextureCache.has(fabricType)) {
    return bumpTextureCache.get(fabricType);
  }

  const size = 256; // 256 is optimal for bump maps without consuming excessive memory
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);

  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;

  // Weave pattern
  const step = fabricType === 'mesh' ? 8 : (fabricType === 'fleece' ? 4 : 2);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      let val = 128;
      
      if (fabricType === 'mesh') {
        // Honeycomb sports mesh pattern
        const cx = (x % 16) - 8;
        const cy = (y % 16) - 8;
        const dist = Math.sqrt(cx * cx + cy * cy);
        val = dist < 5 ? 70 : 160 + (Math.random() * 20 - 10);
      } else if (fabricType === 'fleece') {
        // Soft fluffy noise
        const n = Math.sin(x * 0.5) * Math.cos(y * 0.5) * 30 + (Math.random() * 40 - 20);
        val = 128 + n;
      } else if (fabricType === 'ceramic') {
        // Ultra smooth
        val = 128;
      } else {
        // Cotton weave criss-cross
        const wx = Math.sin(x * Math.PI / step);
        const wy = Math.sin(y * Math.PI / step);
        val = 128 + (wx * wy * 35) + (Math.random() * 15 - 7.5);
      }

      val = Math.max(0, Math.min(255, val));
      data[idx] = val;
      data[idx + 1] = val;
      data[idx + 2] = val;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(fabricType === 'mesh' ? 16 : 32, fabricType === 'mesh' ? 16 : 32);
  texture.needsUpdate = true;
  bumpTextureCache.set(fabricType, texture);
  return texture;
}

/**
 * Draws curved text along an arc on canvas
 */
function drawCurvedText(ctx, text, x, y, radius, angleSpan) {
  const len = text.length;
  if (len === 0) return;

  ctx.save();
  ctx.translate(x, y);

  const startAngle = -angleSpan / 2;
  const angleStep = angleSpan / Math.max(len - 1, 1);

  for (let i = 0; i < len; i++) {
    const char = text[i];
    const angle = startAngle + i * angleStep;

    ctx.save();
    ctx.rotate(angle);
    ctx.translate(0, -radius);
    ctx.fillText(char, 0, 0);
    if (ctx.lineWidth > 0 && ctx.strokeStyle !== 'transparent') {
      ctx.strokeText(char, 0, 0);
    }
    ctx.restore();
  }

  ctx.restore();
}

/**
 * Renders all design layers onto the UV canvas
 */
export async function renderCustomizerCanvas({
  canvas,
  printAreas = [],
  designs = [],
  texts = [],
  cliparts = [],
  showGuide = false,
  activePrintAreaId = null,
  exportMode = false,
  width = 2048,
  height = 2048,
}) {
  if (!canvas) return;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Clear to transparent
  ctx.clearRect(0, 0, width, height);

  // Pre-load all external images
  const imagePromises = designs.map(async (d) => {
    if (d.fileUrl || d.dataUrl) {
      try {
        await preloadImage(d.fileUrl || d.dataUrl);
      } catch (e) {
        console.warn('Could not preload design image:', e);
      }
    }
  });

  await Promise.all(imagePromises);

  // Sort and group layers
  // Render each print area
  for (const area of printAreas) {
    const { bounds } = area;
    if (!bounds) continue;

    const areaX = bounds.x * width;
    const areaY = bounds.y * height;
    const areaW = bounds.w * width;
    const areaH = bounds.h * height;
    const centerX = areaX + areaW / 2;
    const centerY = areaY + areaH / 2;

    // Draw visual guide dashed boundary if enabled (only for active area in customizer mode)
    if (showGuide && !exportMode && activePrintAreaId === area.id) {
      ctx.save();
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.75)';
      ctx.lineWidth = 4;
      ctx.setLineDash([12, 8]);
      ctx.strokeRect(areaX, areaY, areaW, areaH);

      // Corner indicators
      const sz = 16;
      ctx.fillStyle = '#f97316';
      ctx.fillRect(areaX - 4, areaY - 4, sz, sz);
      ctx.fillRect(areaX + areaW - sz + 4, areaY - 4, sz, sz);
      ctx.fillRect(areaX - 4, areaY + areaH - sz + 4, sz, sz);
      ctx.fillRect(areaX + areaW - sz + 4, areaY + areaH - sz + 4, sz, sz);

      // Print Area Label Badge
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(areaX + 8, areaY + 8, 140, 26);
      ctx.font = '600 13px Inter, sans-serif';
      ctx.fillStyle = '#f97316';
      ctx.fillText(`ZONE: ${area.name.toUpperCase()}`, areaX + 16, areaY + 26);
      ctx.restore();
    }

    // Clip content to print boundary unless overflow is permitted
    ctx.save();
    ctx.beginPath();
    ctx.rect(areaX, areaY, areaW, areaH);
    ctx.clip();

    // 1. Draw Designs in this area
    const areaDesigns = designs.filter((d) => d.printArea === area.id && (d.visible !== false));
    for (const d of areaDesigns) {
      const img = imageCache.get(d.fileUrl || d.dataUrl);
      if (!img) continue;

      ctx.save();
      ctx.globalAlpha = d.opacity !== undefined ? d.opacity : 1;

      // Position relative to center of print area
      const posX = centerX + (d.x || 0) * (areaW / 2);
      const posY = centerY + (d.y || 0) * (areaH / 2);

      ctx.translate(posX, posY);
      ctx.rotate(((d.rotation || 0) * Math.PI) / 180);
      ctx.scale(d.flipX ? -1 : 1, d.flipY ? -1 : 1);

      const baseScale = d.scale || 1.0;
      // Fit proportionally
      const aspect = img.width / img.height;
      let drawW, drawH;
      if (aspect >= 1) {
        drawW = areaW * 0.7 * baseScale;
        drawH = drawW / aspect;
      } else {
        drawH = areaH * 0.7 * baseScale;
        drawW = drawH * aspect;
      }

      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();
    }

    // 2. Draw Clipart/Stickers in this area
    const areaCliparts = cliparts.filter((c) => c.printArea === area.id && (c.visible !== false));
    for (const c of areaCliparts) {
      const img = imageCache.get(c.dataUrl);
      if (!img) continue;

      ctx.save();
      ctx.globalAlpha = c.opacity !== undefined ? c.opacity : 1;
      const posX = centerX + (c.x || 0) * (areaW / 2);
      const posY = centerY + (c.y || 0) * (areaH / 2);

      ctx.translate(posX, posY);
      ctx.rotate(((c.rotation || 0) * Math.PI) / 180);
      ctx.scale(c.flipX ? -1 : 1, c.flipY ? -1 : 1);

      const baseScale = c.scale || 1.0;
      const drawSize = Math.min(areaW, areaH) * 0.5 * baseScale;
      ctx.drawImage(img, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
      ctx.restore();
    }

    // 3. Draw Text Layers in this area
    const areaTexts = texts.filter((t) => t.printArea === area.id && (t.visible !== false));
    for (const t of areaTexts) {
      if (!t.text) continue;

      ctx.save();
      ctx.globalAlpha = t.opacity !== undefined ? t.opacity : 1;

      const posX = centerX + (t.x || 0) * (areaW / 2);
      const posY = centerY + (t.y || 0) * (areaH / 2);

      ctx.translate(posX, posY);
      ctx.rotate(((t.rotation || 0) * Math.PI) / 180);

      const fontSize = (t.fontSize || 36) * (t.scale || 1.0) * (width / 1024);
      const fontWeight = t.bold ? 'bold' : (t.fontWeight || '600');
      const fontStyle = t.italic ? 'italic' : 'normal';
      const fontFamily = t.fontFamily || 'Outfit, sans-serif';

      ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
      ctx.textAlign = t.textAlign || 'center';
      ctx.textBaseline = 'middle';

      // Drop Shadow
      if (t.shadow) {
        ctx.shadowColor = t.shadowColor || 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 4;
      }

      // Fill & Stroke
      ctx.fillStyle = t.fillColor || '#ffffff';
      if (t.strokeWidth && t.strokeWidth > 0) {
        ctx.lineWidth = t.strokeWidth * (width / 1024);
        ctx.strokeStyle = t.strokeColor || '#000000';
      } else {
        ctx.lineWidth = 0;
        ctx.strokeStyle = 'transparent';
      }

      // Curved or straight text
      if (t.curved && Math.abs(t.curved) > 5) {
        const radius = (areaW * 0.4) / (Math.abs(t.curved) / 50);
        const span = (t.curved > 0 ? 1 : -1) * (t.text.length * 0.16);
        drawCurvedText(ctx, t.text, 0, t.curved > 0 ? radius : -radius, radius, span);
      } else {
        ctx.fillText(t.text, 0, 0);
        if (ctx.lineWidth > 0) {
          ctx.strokeText(t.text, 0, 0);
        }
      }

      ctx.restore();
    }

    ctx.restore(); // Restore clipping
  }
}
