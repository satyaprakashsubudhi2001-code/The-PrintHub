export function safeParseColors(colors) {
  if (!colors) return ['#18181b', '#ffffff'];
  if (Array.isArray(colors)) return colors;
  if (typeof colors === 'string') {
    let current = colors.trim();
    for (let i = 0; i < 3; i++) {
      if (typeof current === 'string' && (current.startsWith('[') || current.startsWith('{') || current.startsWith('"') || current.startsWith("'"))) {
        try {
          current = JSON.parse(current);
        } catch (e) {
          break;
        }
      } else {
        break;
      }
    }
    if (Array.isArray(current)) return current;
    if (typeof current === 'string' && current.length > 0) {
      if (current.includes(',')) {
        return current.split(',').map((c) => c.trim()).filter(Boolean);
      }
      return [current];
    }
    if (typeof current === 'object' && current !== null) {
      return [current];
    }
  }
  return ['#18181b', '#ffffff'];
}

export function safeParseSizes(sizes) {
  if (!sizes) return ['S', 'M', 'L', 'XL'];
  if (Array.isArray(sizes)) return sizes;
  if (typeof sizes === 'string') {
    let current = sizes.trim();
    for (let i = 0; i < 3; i++) {
      if (typeof current === 'string' && (current.startsWith('[') || current.startsWith('"') || current.startsWith("'"))) {
        try {
          current = JSON.parse(current);
        } catch (e) {
          break;
        }
      } else {
        break;
      }
    }
    if (Array.isArray(current)) return current;
    if (typeof current === 'string' && current.length > 0) {
      if (current.includes(',')) {
        return current.split(',').map((s) => s.trim()).filter(Boolean);
      }
      return [current];
    }
  }
  return ['S', 'M', 'L', 'XL'];
}

export function normalizeCategory(category) {
  if (!category) return 'Apparel';
  if (typeof category === 'object') {
    return category.name || category.title || category.id || 'Apparel';
  }
  return String(category).trim() || 'Apparel';
}

export function normalizeProduct(p) {
  if (!p) return p;
  const rawCat = normalizeCategory(p.category);

  let imageList = [];
  if (Array.isArray(p.images) && p.images.length > 0) {
    imageList = p.images
      .map((img) => (typeof img === 'string' ? img : (img?.url || '')))
      .filter((url) => typeof url === 'string' && url.trim().length > 0 && !url.startsWith('blob:'));
  } else if (typeof p.image === 'string' && p.image.trim().length > 0 && !p.image.startsWith('blob:')) {
    imageList = [p.image.trim()];
  }

  let primaryImage = '';
  if (Array.isArray(p.images) && p.images.length > 0) {
    const primaryObj = p.images.find(img => typeof img === 'object' && img?.isPrimary && !img?.url?.startsWith('blob:'));
    if (primaryObj?.url) primaryImage = primaryObj.url;
  }
  if (!primaryImage && imageList.length > 0) {
    primaryImage = imageList[0];
  }
  if (!primaryImage && typeof p.image === 'string' && p.image.trim().length > 0 && !p.image.startsWith('blob:')) {
    primaryImage = p.image.trim();
  }
  if (!primaryImage) {
    primaryImage = p.previewImage || p.thumbnail || '/logo-mark-symbol.png';
  }

  if (imageList.length === 0 && primaryImage) {
    imageList = [primaryImage];
  }

  const rawStatus = (p.status || '').toUpperCase();
  const isCurrentlyActive = p.isActive !== false && rawStatus !== 'INACTIVE' && rawStatus !== 'ARCHIVED';

  return {
    ...p,
    category: rawCat,
    categoryName: rawCat,
    categoryObj: typeof p.category === 'object' ? p.category : null,
    image: primaryImage,
    images: imageList,
    colors: safeParseColors(p.colors),
    sizes: safeParseSizes(p.sizes),
    status: isCurrentlyActive ? 'ACTIVE' : 'INACTIVE',
    isActive: isCurrentlyActive
  };
}

